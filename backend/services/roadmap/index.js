import express from 'express';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
import roadmapRouter from './src/routes/roadmap.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from the Roadmap service!');
});

app.use('/', roadmapRouter); 

app.listen(port, () => {
  console.log(`Roadmap service is running on port ${port}`);
  connectDB();
});