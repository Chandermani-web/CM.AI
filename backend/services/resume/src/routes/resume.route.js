import express from 'express';
import { uploadResume, getResume } from '../controllers/resume.controller.js';
import upload from '../middlewares/multer.js';

const resumeRouter = express.Router();

resumeRouter.post('/upload', upload.single('resume'), uploadResume);
resumeRouter.get('/get-resume', getResume);

export default resumeRouter;