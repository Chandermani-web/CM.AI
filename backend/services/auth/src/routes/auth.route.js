import express from 'express';
import { addCoin, googleAuth, logout, useCoin } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/login', googleAuth);
authRouter.post('/logout', logout);
authRouter.post("/use-coins", useCoin)
authRouter.post("/add-coins", addCoin) 

export default authRouter;