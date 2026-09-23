import express from 'express';
import { generateRoadmap, getAllRoadmaps, getRoadmap } from '../controllers/roadmap.controller.js';

const roadmapRouter = express.Router();

roadmapRouter.post('/', generateRoadmap);
roadmapRouter.get('/all', getAllRoadmaps);
roadmapRouter.get('/:id', getRoadmap);

export default roadmapRouter;