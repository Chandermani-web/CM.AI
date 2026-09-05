import express from 'express';
import { createOrder, verifyPayment } from '../controllers/billing.controller.js';

const billingRouter = express.Router();

billingRouter.post('/create-order', createOrder);
billingRouter.post('/verify-payment', verifyPayment);

export default billingRouter;