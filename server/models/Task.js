const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,  // Ensure no duplicate phone numbers
    match: [/^\+\d{1,3}\d{6,14}$/, "Phone number must be in international format (e.g., +14155552675)"]
  },
  notes: {
    type: String,
    trim: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });  // 🚀 Automatically add createdAt & updatedAt

// ✅ Ensure `firstName` is properly capitalized
taskSchema.pre('save', function (next) {
  if (this.firstName) {
    this.firstName = this.firstName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  next();
});

// 🚀 Add an index for faster queries
taskSchema.index({ phone: 1, agent: 1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
