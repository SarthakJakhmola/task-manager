const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
 
const app = express();
const PORT = process.env.PORT || 4000;
 
app.use(cors());
app.use(express.json());
 
app.use('/api/tasks', taskRoutes);
 
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});
 
// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
 
// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
 
// Only bind the port when run directly (not during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
 
module.exports = app;
