import express from 'express';
import dotenv from 'dotenv';
import cookiesParser from 'cookie-parser';

import connectDB from './src/config/db.js';
import authRouter from './src/routes/auth.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json({ limit: "25mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  })
);
app.use(cookiesParser());

app.get('/', (req, res) => {
  res.send('Hello from the Auth service!');
});

app.use('/', authRouter); 

app.listen(port, () => {
  console.log(`Auth service is running on port ${port}`);
  connectDB();
});