import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'super_admin', 'analyst', 'recruiter'], default: 'user', index: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
  ticketNo: { type: String, unique: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plan: { type: String, enum: ['single', 'growth', 'scale'], default: 'single' },
  status: { type: String, enum: ['paid', 'assigned_analyst', 'jd_submitted', 'jd_approved', 'recruiter_assigned', 'recruiter_working', 'recruiter_submitted', 'analyst_review', 'delivered', 'revision', 'closed'], default: 'paid', index: true },
  analyst: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jd: { title: String, description: String, skills: [String], location: String, experience: String },
  candidates: [{ name: String, title: String, score: Number, profileUrl: String, notes: String }],
  purchasedAt: { type: Date, default: Date.now },
  slaStartedAt: Date,
  slaDueAt: Date,
  deliveredAt: Date
}, { timestamps: true });

ticketSchema.pre('validate', function(next) {
  if (!this.ticketNo) this.ticketNo = `THR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
  next();
});

const auditSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', index: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  from: String,
  to: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Ticket = mongoose.model('Ticket', ticketSchema);
export const AuditLog = mongoose.model('AuditLog', auditSchema);
