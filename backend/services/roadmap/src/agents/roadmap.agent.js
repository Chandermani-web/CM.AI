import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../config/llm.js";
import roadmapPrompt from "../prompt/roadmap.prompt.js";

const roadmapAgent = async (state) => {
    try {
        const resume = state.resume ? {
            skills: state.resume.skills,
            experience: state.resume.experience,
            projects: state.resume.projects,
            missingSkills: state.resume.missingSkills,
            score: state.resume.score,
            suggestedRole: state.resume.suggestedRole,
            recommendations: state.resume.recommendations,
        } : null;

        const response = await llm.invoke([
            new SystemMessage(roadmapPrompt),
            new HumanMessage(`
                Target Role:
                ${state.role}

                Target Package:
                ${state.targetPackage}

                Resume:
                ${JSON.stringify(resume, null, 2)}
            `)
        ]);

        const roadmap = JSON.parse(response.content.replace(/```json/g, '').replace(/```/g, '').trim());

        const capitalize = (value = "") => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

        roadmap.level = capitalize(roadmap.level);

        roadmap.modules = (roadmap.modules || []).map(module => ({
            ...module,
            difficulty: capitalize(module.difficulty),
        }));

        return {
            ...state,
            roadmap,
        };
    } catch (error) {
        console.error('Error in roadmapAgent:', error);
        return res.status(500).json({ error: 'An error occurred while processing the roadmap agent.' });
    }
}

export default roadmapAgent;