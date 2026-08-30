import summaryPrompt from "../prompts/summaryPrompt.js";
import llm from "../config/llm.js";

export const summaryAgent = async (data) => {
    try {
        const prompt = feedbackPrompt(data);
        const response = await llm.invoke(prompt);
        
        const cleaned = response.content.replace(/```json/g, "").replace(/```/g, "").trim();
        
        return JSON.parse(cleaned);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred during the summary process" , error: error.message });
    }
} 