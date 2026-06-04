const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
 
const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');
 
// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
 
// Load tasks from file on startup, or start with empty array
let tasks = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    tasks = JSON.parse(raw);
  } catch {
    tasks = [];
  }
}
 
function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Failed to persist tasks:', err.message);
  }
}
 
function getAll() {
  // Sort by createdAt descending (newest first)
  return [...tasks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}
 
function getById(id) {
  return tasks.find((t) => t.id === id) || null;
}
 
function create({ title, description = '', dueDate = null }) {
  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  persist();
  return task;
}
 
function update(id, fields) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
 
  const allowed = ['title', 'description', 'dueDate', 'completed'];
  allowed.forEach((key) => {
    if (key in fields) {
      tasks[idx][key] =
        typeof fields[key] === 'string' ? fields[key].trim() : fields[key];
    }
  });
  tasks[idx].updatedAt = new Date().toISOString();
  persist();
  return tasks[idx];
}
 
function remove(id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  persist();
  return true;
}
 
module.exports = { getAll, getById, create, update, remove };