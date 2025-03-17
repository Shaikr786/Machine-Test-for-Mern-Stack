const mongoose = require('mongoose');
const User = require('./User');

const taskSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+\d{10,15}$/, "Phone number must start with '+' followed by 10 to 15 digits"] // Updated validation
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"]
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      default: null // Task starts unassigned
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin user who created/uploaded the task
      required: [true, "UploadedBy (admin) is required"]
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  });
  
// ✅ Ensure `firstName` is saved with proper capitalization
taskSchema.pre('save', function (next) {
  if (this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
