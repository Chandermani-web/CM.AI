import express from "express";
import { startInterview, submitAnswer, getInterview } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/answer", submitAnswer);
interviewRouter.get("/:id", getInterview);

export default interviewRouter;