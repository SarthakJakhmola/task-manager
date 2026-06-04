const express = require('express');
const router = express.Router();
const store = require('../store/tasks');
 
// GET /api/tasks?status=all|active|completed&search=
router.get('/', (req, res) => {
  const { status = 'all', search = '' } = req.query;
  let tasks = store.getAll();
 
  if (status === 'active') {
    tasks = tasks.filter((t) => !t.completed);
  } else if (status === 'completed') {
    tasks = tasks.filter((t) => t.completed);
  }
 
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
  }
 
  const counts = {
    total: store.getAll().length,
    active: store.getAll().filter((t) => !t.completed).length,
    completed: store.getAll().filter((t) => t.completed).length,
  };
 
  res.json({ tasks, counts });
});
 
// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});
 
// POST /api/tasks
router.post('/', (req, res) => {
  const { title, description, dueDate } = req.body;
 
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
 
  const task = store.create({ title, description, dueDate });
  res.status(201).json(task);
});
 
// PATCH /api/tasks/:id
router.patch('/:id', (req, res) => {
  const { title, description, dueDate, completed } = req.body;
 
  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
 
  const task = store.update(req.params.id, {
    title,
    description,
    dueDate,
    completed,
  });
 
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});
 
// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});
 
module.exports = router;