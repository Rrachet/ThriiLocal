import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { User, Ticket, AuditLog } from './models.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'development-only-secret';
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const sign = user => jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    req.user = await User.findById(jwt.verify(token, JWT_SECRET).sub);
    if (!req.user?.active) return res.status(401).json({ error: 'User is inactive' });
    next();
  } catch { res.status(401).json({ error: 'Invalid or expired token' }); }
};
const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Insufficient permissions' });
const audit = async (ticket, actor, action, from, to, metadata = {}) => AuditLog.create({ ticket, actor, action, from, to, metadata });
const transition = async (ticket, next, actor, action, metadata) => {
  const previous = ticket.status;
  ticket.status = next;
  if (next === 'recruiter_assigned') {
    ticket.slaStartedAt = new Date();
    ticket.slaDueAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  }
  if (next === 'delivered') ticket.deliveredAt = new Date();
  await ticket.save();
  await audit(ticket._id, actor, action, previous, next, metadata);
  return ticket;
};

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'thrii-local-api', timestamp: new Date().toISOString() }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ error: 'Name, email and an 8+ character password are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: 'user' });
    res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/me', auth, (req, res) => res.json({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }));

app.post('/api/tickets/checkout', auth, allow('user'), async (req, res) => {
  const prices = { single: 499900, growth: 999900, scale: 1999900 };
  const plan = req.body.plan || 'single';
  if (!prices[plan]) return res.status(400).json({ error: 'Invalid plan' });
  if (stripe) {
    const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price_data: { currency: 'inr', product_data: { name: `Thrii ${plan} hiring ticket` }, unit_amount: prices[plan] }, quantity: 1 }], success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${process.env.CLIENT_URL}/plans` });
    return res.json({ checkoutUrl: session.url });
  }
  const ticket = await Ticket.create({ owner: req.user._id, plan });
  await audit(ticket._id, req.user._id, 'TICKET_PURCHASED', null, 'paid', { mode: 'development' });
  res.status(201).json({ ticket, payment: 'development_mode' });
});

app.get('/api/tickets', auth, async (req, res) => {
  const filter = req.user.role === 'user' ? { owner: req.user._id } : req.user.role === 'analyst' ? { analyst: req.user._id } : req.user.role === 'recruiter' ? { recruiter: req.user._id } : {};
  res.json(await Ticket.find(filter).populate('owner analyst recruiter', 'name email role').sort({ createdAt: -1 }));
});

app.get('/api/tickets/:id', auth, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('owner analyst recruiter', 'name email role');
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  const visible = req.user.role === 'super_admin' || [ticket.owner?._id, ticket.analyst?._id, ticket.recruiter?._id].some(id => id?.toString() === req.user._id.toString());
  if (!visible) return res.status(403).json({ error: 'Forbidden' });
  const auditTrail = await AuditLog.find({ ticket: ticket._id }).populate('actor', 'name role').sort({ createdAt: 1 });
  res.json({ ticket, auditTrail });
});

app.post('/api/tickets/:id/jd', auth, allow('user'), async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, owner: req.user._id });
  if (!ticket || !['paid', 'revision'].includes(ticket.status)) return res.status(409).json({ error: 'Ticket is not accepting a JD' });
  ticket.jd = req.body; await transition(ticket, 'jd_submitted', req.user._id, 'JD_SUBMITTED'); res.json(ticket);
});

app.post('/api/admin/tickets/:id/assign-analyst', auth, allow('super_admin'), async (req, res) => {
  const [ticket, analyst] = await Promise.all([Ticket.findById(req.params.id), User.findOne({ _id: req.body.analystId, role: 'analyst' })]);
  if (!ticket || !analyst) return res.status(404).json({ error: 'Ticket or analyst not found' });
  ticket.analyst = analyst._id; await transition(ticket, 'assigned_analyst', req.user._id, 'ANALYST_ASSIGNED', { analystId: analyst._id }); res.json(ticket);
});

app.post('/api/analyst/tickets/:id/approve-jd', auth, allow('analyst'), async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, analyst: req.user._id });
  if (!ticket || ticket.status !== 'jd_submitted') return res.status(409).json({ error: 'JD is not awaiting analyst approval' });
  await transition(ticket, 'jd_approved', req.user._id, 'JD_APPROVED'); res.json(ticket);
});

app.post('/api/analyst/tickets/:id/assign-recruiter', auth, allow('analyst'), async (req, res) => {
  const [ticket, recruiter] = await Promise.all([Ticket.findOne({ _id: req.params.id, analyst: req.user._id }), User.findOne({ _id: req.body.recruiterId, role: 'recruiter' })]);
  if (!ticket || !recruiter || ticket.status !== 'jd_approved') return res.status(409).json({ error: 'Ticket is not ready for recruiter assignment' });
  ticket.recruiter = recruiter._id; await transition(ticket, 'recruiter_assigned', req.user._id, 'RECRUITER_ASSIGNED', { recruiterId: recruiter._id, slaHours: 72 }); res.json(ticket);
});

app.post('/api/recruiter/tickets/:id/submit', auth, allow('recruiter'), async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, recruiter: req.user._id });
  if (!ticket || !['recruiter_assigned', 'recruiter_working'].includes(ticket.status)) return res.status(409).json({ error: 'Ticket is not assigned to this recruiter' });
  ticket.candidates = req.body.candidates || [];
  await transition(ticket, 'recruiter_submitted', req.user._id, 'RECRUITER_SUBMITTED', { candidateCount: ticket.candidates.length });
  res.json(ticket);
});

app.post('/api/analyst/tickets/:id/deliver', auth, allow('analyst'), async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, analyst: req.user._id });
  if (!ticket || ticket.status !== 'recruiter_submitted') return res.status(409).json({ error: 'Recruiter submission is not awaiting review' });
  await transition(ticket, 'delivered', req.user._id, 'RESULTS_DELIVERED'); res.json(ticket);
});

app.get('/api/admin/analytics', auth, allow('super_admin'), async (_, res) => {
  const [counts, sla] = await Promise.all([
    Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Ticket.aggregate([{ $match: { slaDueAt: { $exists: true }, status: { $nin: ['delivered', 'closed'] } } }, { $group: { _id: null, atRisk: { $sum: { $cond: [{ $lt: ['$slaDueAt', new Date(Date.now() + 12 * 60 * 60 * 1000)] }, 1, 0] } }, breached: { $sum: { $cond: [{ $lt: ['$slaDueAt', new Date()] }, 1, 0] } } } }])
  ]);
  res.json({ byStatus: counts, sla: sla[0] || { atRisk: 0, breached: 0 } });
});

const port = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thriilocal').then(() => app.listen(port, () => console.log(`ThriiLocal API listening on ${port}`))).catch(err => { console.error('MongoDB connection failed', err); process.exit(1); });
