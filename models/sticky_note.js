const mongoose = require('mongoose');

const stickyNoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Task'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const StickyNote = mongoose.model('StickyNote', stickyNoteSchema);

module.exports = StickyNote;
