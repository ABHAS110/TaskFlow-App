const mongoose = require('mongoose');

const VALID_STAGES = ['Todo', 'In Progress', 'Done'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    stage: {
      type: String,
      enum: {
        values: VALID_STAGES,
        message: 'Stage must be one of: Todo, In Progress, Done',
      },
      default: 'Todo',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient per-user queries
taskSchema.index({ userId: 1, stage: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
