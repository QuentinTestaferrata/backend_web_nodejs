const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
//DB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Quentin:Qr931768463@cluster0.7qxergy.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Task Manager API!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
