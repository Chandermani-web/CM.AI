import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm  from "../config/llm.js";
import searchVideo from "../config/youtube.js";

const resourceAgent = async (state) => {
    try {
        const roadmap = state.roadmap;
        const modulesTitle = roadmap.modules.map(module => module.title).join('\n');
        
        const docsResponse = await llm.invoke([
            new SystemMessage(`
                You are an expert software engineer.

                For every module below return the offical documentation.

                Rules:

                1. Prefer offical documentation.
                2. If offical documentation does not exist, return the best learning article.
                3. Return ONLY valid JSON.
                4. Do not explain enything.
                5. keep the same title.

                Return format:

                [
                    {
                        "title": "",
                        "article": ""
                    }
                ]
            `), 

            new HumanMessage(`
                modules: ${modulesTitle}
            `)
        ]);

        let docs = [];

        try {
            docs = JSON.parse(docsResponse.content.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (error) {
            // return res.status(400).json({ error: 'Error parsing docs response:', error });
            console.error('Error parsing docs response:', error);
        }

        const docsMap = new Map();

        docs.forEach(doc => {
            docsMap.set(doc.title.toLowerCase(), doc.article);
        });

        roadmap.modules = await Promise.all(
            roadmap.modules.map(async (module) => {
                let video = null;

                try {
                    video = await searchVideo(module.title);
                } catch (error) {
                    console.error(`Error fetching video for module ${module.title}:`, error);
                }

                return {
                    ...module,
                    youtube: video?.[0]?.url || '',
                    article: docsMap.get(module.title.toLowerCase()) || "",
                }
            })
        );

        return {
            ...state,
            roadmap,
        }
    } catch (error) {
        console.error('Error in resourceAgent:', error);
        return res.status(500).json({ error: 'An error occurred while processing the resource agent.' });
    }
}

export default resourceAgent;