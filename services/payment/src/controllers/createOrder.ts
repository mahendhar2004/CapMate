import { Request, Response, NextFunction } from 'express';
import { razorpay } from '../services/razorpay';
import { prisma } from '../services/db';
import { logger } from '@capmate/shared';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, listingId } = req.body;
        const userId = req.user.sub;

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        const payment = await prisma.payment.create({
            data: {
                amount: amount,
                currency: "INR",
                userId: userId,
                razorpayOrderId: order.id,
                status: 'PENDING',
                listingId: listingId,
            },
        });

        logger.info(`Razorpay order created: ${order.id} for user ${userId}`);

        res.status(201).json({
            orderId: order.id,
            paymentId: payment.id,
            amount: amount,
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        next(error);
    }
};
