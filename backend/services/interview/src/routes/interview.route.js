import express from "express";
import { startInterview, submitAnswer, getInterview, getAllInterviews } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/answer", submitAnswer);
interviewRouter.get("/all-interview", getAllInterviews);
interviewRouter.get("/:id", getInterview);

export default interviewRouter;     