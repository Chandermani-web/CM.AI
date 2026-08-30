import { resumeAgent } from "../agents/resume.agent.js";
import extractText from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import redis from "../../../../shared/redis/redis.js";
import fs from "fs/promises";

export const uploadResume = async (req, res) => {
  let file;

  try {
    file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not provided" });
    }

    const resumeText = await extractText(file.path);

    const aiResponse = await resumeAgent(resumeText);

    const resumeData = JSON.parse(aiResponse);

    let resume = await Resume.findOne({ userId });

    if (!resume) {
      resume = await Resume.create({
        userId,
        ...resumeData,
        extractText: resumeText,
      });
    } else {
      resume = await Resume.findByIdAndUpdate(
        resume._id,
        { ...resumeData, extractText: resumeText },
        { returnDocument: "after" },
      );
    }

    // Store the resume data in Redis
    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    await fs.unlink(file.path);

    res
      .status(200)
      .json({
        success: true,
        message: "Resume Analyzed successfully",
        data: resume,
      });
  } catch (error) {
    if (file) {
      await fs.unlink(file.path);
    }
    return res
      .status(500)
      .json({
        success: false,
        message: "Error analyzing resume",
        error: error.message,
      });
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const cachedResume = await redis.get(`resume:${userId}`);

    if (cachedResume) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Resume fetched successfully",
          count: 1,
          source: "redis",
          data: JSON.parse(cachedResume),
        });
    }

    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    // Store the resume data in Redis
    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    res
      .status(200)
      .json({
        success: true,
        message: "Resume fetched successfully",
        count: 1,
        source: "database",
        data: resume,
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching resume",
        error: err.message,
      });
  }
};
