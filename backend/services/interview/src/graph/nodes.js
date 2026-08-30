import { feedbackAgent } from "../agents/feedback.agent.js";
import { interviewAgent } from "../agents/interview.agent.js";
import { summaryAgent } from "../agents/summary.agent.js";

export async function interviewNode(state) {
    try {
        const question = await interviewAgent({
            action: state.action,
            type: state.type,
            useResume: state.useResume,
            resume: state.resume,
        })
        return question;
    } catch (error) {
        return res.status(500).json({ message: "An error occurred during the interview node process" , error: error.message });
    }
}

export async function feedbackNode(state) {
    try {
        const feedback = await feedbackAgent({
            question: state.question,
            answer: state.answer,
            difficulty: state.difficulty,
        }); 
        return feedback;
    } catch (error) {
        return res.status(500).json({ message: "An error occurred during the feedback node process" , error: error.message });
    }
}

export async function summaryNode(state) {
    try {
        const summary = await summaryAgent({
            role: state.role,
            type: state.type,
            questions: state.questions,
        });
        return summary;
    } catch (error) {
        return res.status(500).json({ message: "An error occurred during the summary node process" , error: error.message });
    }
}