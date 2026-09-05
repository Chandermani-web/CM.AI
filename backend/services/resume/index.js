import express from 'express';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
import resumeRouter from './src/routes/resume.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8002;

app.use(express.json({ limit: "25mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  })
);

app.get('/', (req, res) => {
  res.send('Hello from the Resume service!');
});

app.use('/', resumeRouter); 

app.listen(port, () => {
  console.log(`Resume service is running on port ${port}`);
  connectDB();
});