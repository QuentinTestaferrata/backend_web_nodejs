const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Task Manager API!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
