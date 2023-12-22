const express = require('express');
const router = express.Router();

// CRUD operations

// GET all tasks
router.get('/tasks', (req, res) => {
});

// GET a single task by id
router.get('/tasks/:id', (req, res) => {
});

// POST a new task
router.post('/tasks', (req, res) => {
});

// PUT to update a task
router.put('/tasks/:id', (req, res) => {
});

// DELETE a task
router.delete('/tasks/:id', (req, res) => {
});

module.exports = router;
