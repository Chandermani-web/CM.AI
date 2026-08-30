import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { isAuth } from './middleware/isAuth.js';
import { getCurrentUser } from './controller/user.controller.js';
import { proxyWithHeaders } from './utils/proxyWithHeaders.js';

dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '25mb' }));           // was likely default '100kb'
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello from the gateway!');
});

app.use('/api/auth', proxy(`${process.env.AUTH_SERVICE_URL}`));
app.use('/api/resume', isAuth, proxyWithHeaders(`${process.env.RESUME_SERVICE_URL}`));
app.use('/api/interview', isAuth, proxyWithHeaders(`${process.env.INTERVIEW_SERVICE_URL}`));
app.get("/api/me", isAuth, getCurrentUser);

app.listen(port, () => {
  console.log(`Gateway server is running on port ${port}`);
});