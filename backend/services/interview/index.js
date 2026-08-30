import express from 'express';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
import interviewRouter from './src/routes/interview.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from the Resume service!');
});

app.use('/', interviewRouter); 

app.listen(port, () => {
  console.log(`Resume service is running on port ${port}`);
  connectDB();
});