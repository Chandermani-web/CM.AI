import hrInterviewPrompt from "../prompts/hrInterviewPrompt.js";
import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt.js";
import llm from "../config/llm.js";

export const interviewAgent = async (data) => {
    try {
        const prompt = data?.type.toLowerCase() === "hr" ? hrInterviewPrompt(data) : technicalInterviewPrompt(data);

        const response = await llm.invoke(prompt);
        
        const cleaned = response.content.replace(/```json/g, "").replace(/```/g, "").trim();
        
        return JSON.parse(cleaned);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred during the interview process" , error: error.message });
    }
} 