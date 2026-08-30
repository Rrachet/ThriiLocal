import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Ticket, AuditLog } from './models.js';

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thriilocal');
await User.deleteMany({ email: { $in: ['admin@thrii.local', 'analyst@thrii.local', 'recruiter@thrii.local', 'customer@thrii.local'] } });
const passwordHash = await bcrypt.hash('Demo@12345', 12);
const [admin, analyst, recruiter, customer] = await User.create([
  { name: 'Super Admin', email: 'admin@thrii.local', passwordHash, role: 'super_admin' },
  { name: 'Product Analyst', email: 'analyst@thrii.local', passwordHash, role: 'analyst' },
  { name: 'Lead Recruiter', email: 'recruiter@thrii.local', passwordHash, role: 'recruiter' },
  { name: 'Demo Customer', email: 'customer@thrii.local', passwordHash, role: 'user' }
]);
const ticket = await Ticket.create({ owner: customer._id, plan: 'single', status: 'recruiter_assigned', analyst: analyst._id, recruiter: recruiter._id, jd: { title: 'Senior Product Manager', description: 'Own product discovery, roadmap and execution.', skills: ['Product Strategy', 'SQL', 'Analytics'], location: 'Hyderabad', experience: '4-7 years' }, slaStartedAt: new Date(), slaDueAt: new Date(Date.now() + 72 * 60 * 60 * 1000) });
await AuditLog.insertMany([
  { ticket: ticket._id, actor: customer._id, action: 'TICKET_PURCHASED', to: 'paid' },
  { ticket: ticket._id, actor: admin._id, action: 'ANALYST_ASSIGNED', from: 'paid', to: 'assigned_analyst', metadata: { analystId: analyst._id } },
  { ticket: ticket._id, actor: analyst._id, action: 'JD_APPROVED', from: 'jd_submitted', to: 'jd_approved' },
  { ticket: ticket._id, actor: analyst._id, action: 'RECRUITER_ASSIGNED', from: 'jd_approved', to: 'recruiter_assigned', metadata: { recruiterId: recruiter._id, slaHours: 72 } }
]);
console.log('Demo environment seeded. Demo password: Demo@12345');
await mongoose.disconnect();
