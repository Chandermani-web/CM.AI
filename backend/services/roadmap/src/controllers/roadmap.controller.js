import graph from "../graph/roadmap.graph.js";
import Roadmap from "../models/roadmap.model.js";
import redis from "../../../../shared/redis/redis.js";

export const generateRoadmap = async (req, res) => {
    try {
        const { role, targetPackage, useResume, resume } = req.body;
        const userId = req.headers['x-user-id'];

        if(!role || !targetPackage) {
            return res.status(400).json({ error: 'Role and target package are required.' });
        }

        if(useResume && !resume) {
            return res.status(400).json({ error: 'Resume is required when useResume is true.' });
        }

        const result = await graph.invoke({
            role, targetPackage, useResume, resume
        });

        const roadmap = await Roadmap.create({
            userId,
            ...result.roadmap,      
        });

        await redis.del(`roadmaps:${userId}`); 
        await redis.set(`roadmap:${roadmap._id}`, JSON.stringify(roadmap), 'EX', 3600);

        return res.status(201).json({ success: true, message: 'Roadmap generated successfully.', data:roadmap });

    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while generating the roadmap.', error: error.message });
    }
}

export const getAllRoadmaps = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const cachedData = await redis.get(`roadmaps:${userId}`);

        if (cachedData) {
            return res.status(200).json({ success: true, message: "Data retrieved from Redis cache.", data: JSON.parse(cachedData) });
        }

        const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });

        await redis.set(`roadmaps:${userId}`, JSON.stringify(roadmaps), 'EX', 3600); // Cache for 1 hour
        return res.status(200).json({ success: true, message: "Roadmaps retrieved successfully.", data: roadmaps });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while retrieving the roadmaps.' });
    }
}

export const getRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['x-user-id'];
        const cachedData = await redis.get(`roadmap:${id}:${userId}`);

        if (cachedData) {
            return res.status(200).json({ success: true, message: "Data retrieved from Redis cache.", data: JSON.parse(cachedData) });
        }

        const roadmap = await Roadmap.findOne({ _id: id, userId });

        if (!roadmap) {
            return res.status(404).json({ error: 'Roadmap not found.' });
        }

        await redis.set(`roadmap:${id}:${userId}`, JSON.stringify(roadmap), 'EX', 3600); // Cache for 1 hour
        return res.status(200).json({ success: true, message: "Roadmap retrieved successfully.", data: roadmap });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while retrieving the roadmap.' });
    }
}