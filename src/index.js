const express = require('express');
const app = express();
const PORT = 3000;
const taskRoutes = require('./routes/tasks');

app.use(taskRoutes);
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hi TaskmanagerAPI!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
