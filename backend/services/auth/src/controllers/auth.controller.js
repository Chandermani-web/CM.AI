import { getAuth } from 'firebase-admin/auth';
import crypto from 'crypto';

import User from '../models/user.model.js';
import { firebaseApp } from '../config/firebase.js';
import redis from '../../../../shared/redis/redis.js';

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        
        const decodedToken = await getAuth(firebaseApp).verifyIdToken(token);
        const { uid, email, name } = decodedToken;

        const existingUser = await User.findOne({ firebaseUid: uid });
        
        const newUser = existingUser ? null : await User.create({
            firebaseUid: uid,   
            username: name,
            email: email
        });

        const sessionId = crypto.randomUUID();

        await redis.set(`session:${sessionId}`, JSON.stringify({
            userId: existingUser ? existingUser._id : newUser._id,
            username: existingUser ? existingUser.username : newUser.username,
            email: existingUser ? existingUser.email : newUser.email,
            interviewCoin: existingUser ? existingUser.interviewCoin : newUser.interviewCoin
        }), 'EX', 7 * 24 * 60 * 60);

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(201).json({ success: true, message: 'User created successfully', user: existingUser ? existingUser : newUser });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });  
    }
}

export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.session;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No session found' });
        }

        await redis.del(`session:${sessionId}`);
        res.clearCookie("session");

        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}

export const useCoin = async (req, res) => {
    try {
        const sessionId = req.cookies?.session;
        const { coins, action } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No session found' });
        }

        const sessionData = await redis.get(`session:${sessionId}`);
        if (!sessionData) {
            return res.status(400).json({ success: false, message: 'Invalid session' });
        }

        const session = JSON.parse(sessionData);
        
        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if(user.interviewCoin < coins) {
            return res.status(403).json({ success: false, message: 'Insufficient coins', interviewCoin: user.interviewCoin });
        }

        // if(action === 'deduct') {
        //     user.interviewCoin -= coins;
        // }

        user.interviewCoin -= coins;

        await user.save();

        await redis.set(`session:${sessionId}`, JSON.stringify({
            ...session,
            interviewCoin: user.interviewCoin
        }), 'EX', 7 * 24 * 60 * 60);

        return res.status(200).json({ success: true, message: 'Coin updated successfully', interviewCoin: user.interviewCoin, action: action });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}

export const addCoin = async (req, res) => {
    try {
        const sessionId = req.cookies?.session;
        const { coins } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'No session found' });
        }

        const sessionData = await redis.get(`session:${sessionId}`);
        if (!sessionData) {
            return res.status(400).json({ success: false, message: 'Invalid session' });
        }

        const session = JSON.parse(sessionData);
        
        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if(!coins || coins <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid coin amount' });
        }

        user.interviewCoin += Number(coins);

        await user.save();

        await redis.set(`session:${sessionId}`, JSON.stringify({
            ...session,
            interviewCoin: user.interviewCoin
        }), 'EX', 7 * 24 * 60 * 60);
        
        return res.status(200).json({ success: true, message: 'Coin added successfully', interviewCoin: user.interviewCoin });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
}