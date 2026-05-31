const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateStage,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All task routes are protected
router.use(protect);

router.route('/').get(getTasks).post(createTask);

router.route('/:id').put(updateTask).delete(deleteTask);

router.patch('/:id/stage', updateStage);

module.exports = router;
