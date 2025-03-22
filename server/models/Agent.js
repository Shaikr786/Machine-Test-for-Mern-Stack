const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: { // ✅ Ensure phone follows international format
    type: String,
    required: true,
    match: [/^\+\d{1,3}\d{6,14}$/, "Phone number must be in international format (e.g., +14155552675)"]
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['agent'],
    default: 'agent'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

agentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Agent = mongoose.model('Agent', agentSchema);
module.exports = Agent;
