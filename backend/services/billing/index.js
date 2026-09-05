import express from 'express';
import dotenv from 'dotenv';
import CookieParser from 'cookie-parser';

import connectDB from './src/config/db.js';
import billingRouter from './src/routes/billing.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());

app.get('/', (req, res) => {
  res.send('Hello from the Billing service!');
});

app.use('/', billingRouter); 

app.listen(port, () => {
  console.log(`Billing service is running on port ${port}`);
  connectDB();
});