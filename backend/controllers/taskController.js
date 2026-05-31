const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const VALID_STAGES = ['Todo', 'In Progress', 'Done'];

/**
 * @desc    Get all tasks for the authenticated user
 * @route   GET /api/tasks
 * @access  Private
 * @query   stage - filter by stage (optional)
 * @query   search - search by title/description (optional)
 */
const getTasks = asyncHandler(async (req, res) => {
  const { stage, search } = req.query;

  const filter = { userId: req.user._id };

  if (stage && VALID_STAGES.includes(stage)) {
    filter.stage = stage;
  }

  if (search && search.trim()) {
    filter.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, stage } = req.body;

  if (!title || !title.trim()) {
    res.status(400);
    throw new Error('Task title is required');
  }

  if (stage && !VALID_STAGES.includes(stage)) {
    res.status(400);
    throw new Error('Invalid stage. Must be one of: Todo, In Progress, Done');
  }

  const task = await Task.create({
    title: title.trim(),
    description: description ? description.trim() : '',
    stage: stage || 'Todo',
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid task ID format');
  }

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Verify ownership
  if (task.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const { title, description, stage } = req.body;

  if (title !== undefined && !title.trim()) {
    res.status(400);
    throw new Error('Task title cannot be empty');
  }

  if (stage && !VALID_STAGES.includes(stage)) {
    res.status(400);
    throw new Error('Invalid stage. Must be one of: Todo, In Progress, Done');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(stage && { stage }),
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedTask,
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid task ID format');
  }

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Verify ownership
  if (task.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await Task.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    data: { id },
    message: 'Task deleted successfully',
  });
});

/**
 * @desc    Update a task's stage (for drag-and-drop)
 * @route   PATCH /api/tasks/:id/stage
 * @access  Private
 */
const updateStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid task ID format');
  }

  if (!stage) {
    res.status(400);
    throw new Error('Stage is required');
  }

  if (!VALID_STAGES.includes(stage)) {
    res.status(400);
    throw new Error('Invalid stage. Must be one of: Todo, In Progress, Done');
  }

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Verify ownership
  if (task.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { stage },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedTask,
  });
});

module.exports = { getTasks, createTask, updateTask, deleteTask, updateStage };
