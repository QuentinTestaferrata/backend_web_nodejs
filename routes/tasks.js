const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Task = require('../models/task'); 
const StickyNote = require('../models/sticky_note');

///////////////////////////
////////// TASKS //////////
///////////////////////////

// GET all tasks
//Voorbeeld: GET http://localhost:3000/tasks
//Zoeken op task titel: http://localhost:3000/tasks?search="TaskTitel"
router.get('/', async (req, res) => {
  let { page, pageSize, search } = req.query;
  page = page >= 1 ? parseInt(page) : 1;
  pageSize = pageSize >= 1 ? parseInt(pageSize) : 10;

  let query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' }; // non- case sensitive search
  }
  try {
    const tasks = await Task.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const tasksWithStickyNotes = await Promise.all(tasks.map(async (task) => {
      const stickyNotes = await StickyNote.find({ task: task._id }).select('content -_id'); //"content field" selecten en id wegdoen van stikynote
      return {
        ...task.toObject(),
        stickyNotes: stickyNotes.map(note => note.content) // sticky notes transformen naar array van strings
      };
    }));

    res.json(tasksWithStickyNotes);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET single task by id with corresponding sticky notes
//Voorbeeld: GET http://localhost:3000/tasks/65898989097100c7342bd57d
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');

    const stickyNotes = await StickyNote.find({ task: req.params.id });

    res.json({ task, stickyNotes });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// POST new task met data validatie
// Voorbeeld: POST http://localhost:3000/tasks
//body -> raw 
//{
//  "title": "new Task",
//  "description": "This is a sample task",
//  "priority": "High",
//  "dueDate": "2023-01-30",
//  "status": "Pending"
//}
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
// Voorbeeld: PUT http://localhost:3000/tasks/65898989097100c7342bd57d
// body -> raw
//{
//  "title": "Updated Task",
//  "status": "Completed"
//}
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
// Voorbeeld: DELETE http://localhost:3000/tasks/65898989097100c7342bd57d
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

//voorbeeld : DELETE http://localhost:3000/tasks/del/all
//Delete All Tasks
router.delete('/del/all', async (req, res) => {
  try {
    await Task.deleteMany({});
    res.json({ message: 'All tasks deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//////////////////////////////////
////////// STICKY NOTES //////////
//////////////////////////////////

// POST a new Sticky Note
//Voorbeeld: POST http://localhost:3000/tasks/65898360b57075c6ae776545/stickynotes
//body->raw-> 
// {
//    "content": "StickyNote Voorbeeld"
// }
router.post('/:id/stickynotes', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    const stickyNote = new StickyNote({
      ...req.body,
      task: req.params.id
    });

    await stickyNote.save();
    res.status(201).json(stickyNote);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// DELETE a Sticky Note by ID
// Voorbeeld: DELETE http://localhost:3000/tasks/stickynotes/65898cc4097100c7342bd592
router.delete('/stickynotes/:noteId', async (req, res) => {
  try {
    const stickyNote = await StickyNote.findById(req.params.noteId);
    if (!stickyNote) return res.status(404).send('Sticky note not found');

    await StickyNote.deleteOne({ _id: req.params.noteId });
    res.json({ message: 'Sticky note deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// PUT to update a sticky note's content
// Voorbeeld: PUT http://localhost:3000/tasks/stickynotes/5f2b88b6ec4d6638c0521f2b
//body->raw
//{
//  "content": "Update van content van stickynote."
//}
router.put('/stickynotes/:noteId', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).send('Content is required');
    }

    const stickyNote = await StickyNote.findById(req.params.noteId);
    if (!stickyNote) return res.status(404).send('Sticky note not found');

    stickyNote.content = content;
    await stickyNote.save();

    res.json({ message: 'Sticky note updated', stickyNote });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// DELETE all sticky notes for a specific task
// Example: DELETE http://localhost:3000/tasks/65898360b57075c6ae776545/stickynotes/all
router.delete('/:id/stickynotes/all', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    await StickyNote.deleteMany({ task: req.params.id });
    res.json({ message: 'All sticky notes for the task deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});


module.exports = router;