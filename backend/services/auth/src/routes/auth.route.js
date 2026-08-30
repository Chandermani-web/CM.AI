import express from 'express';
import { googleAuth, logout, useCoin } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/login', googleAuth);
authRouter.post('/logout', logout);
authRouter.post("/use-coins", useCoin)
export default authRouter;