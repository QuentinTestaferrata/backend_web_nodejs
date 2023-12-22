const express = require('express');
const router = express.Router();

let tasks = [];
let currentId = 0;

// GET all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});
  
// GET a single task by id
router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  });

// POST a new task
router.post('/', (req, res) => {
  const { title, description, priority, dueDate, status } = req.body;

  const newTask = {
    id: ++currentId,
    title,
    description,
    priority,
    dueDate,
    status
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


// PUT to update a task
router.put('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');
  
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description
    task.priority = req.body.priority|| task.priority
    task.dueDate = req.body.dueDate || task.dueDate
    task.status = req.body.status || task.status
    res.json(task);
  });
  
// DELETE a task
router.delete('/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).send('Task not found');
  
    const deletedTask = tasks.splice(taskIndex, 1);
    res.json(deletedTask);
  });

module.exports = router;