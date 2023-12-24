const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Task = require('../models/task'); 

// GET all tasks
// GET all with search for example     http://localhost:3000/tasks?search=testtask

router.get('/', async (req, res) => {
  let { page, pageSize, search } = req.query;
  page = page >= 1 ? parseInt(page) : 1;
  pageSize = pageSize >= 1 ? parseInt(pageSize) : 10;

  let query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' }; //case niet sensitive maken
  }
  try {
    const tasks = await Task.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// GET single task by id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  } catch (error) {
    res.status(500).send('Server error');
  }
});





// POST a new task with data validation
router.post('/',
[
  body('title').not().isEmpty().withMessage('Title is required'),
  body('description').not().isEmpty().withMessage('Description is required'),
  body('priority').isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority value (High, Medium, Low)'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date (2023-01-30)'),
  body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value (Pending, In Progress, Completed)'),
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let task = new Task({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        status: req.body.status
      });

      task = await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }
);

// PUT to update a task
router.put('/:id', 
[
  body('title').optional(),
  body('description').optional(),
  body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority value (High, Medium, Low)'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date (2023-01-30)'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value(Pending, In Progress, Completed)'),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.status = req.body.status || task.status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');

    await Task.deleteOne({ _id: req.params.id });
    res.json('Task deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});
router.delete('/del/all', async (req, res) => {
  try {
    await Task.deleteMany({});
    res.json({ message: 'All tasks deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;