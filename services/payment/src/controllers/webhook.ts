import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../services/db';
import { CONFIG } from '../config';
import { publishPaymentSuccess } from '../services/sqs';
import { logger, AppError } from '@capmate/shared';

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shasum = crypto.createHmac('sha256', CONFIG.RAZORPAY.KEY_SECRET);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        const signature = req.headers['x-razorpay-signature'];

        if (digest !== signature) {
            logger.error('Invalid Razorpay signature');
            // Respond with 200 even on error to prevent Razorpay retries, but log it as major security event
            throw new AppError('Invalid signature', 400);
        }

        const { payload } = req.body;

        // Check if it's a payment captured event
        if (payload.payment && payload.payment.entity) {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const status = paymentEntity.status;

            if (status === 'captured') {
                // Update payment status
                const updatedPayment = await prisma.payment.findFirst({ where: { razorpayOrderId: orderId } });

                if (updatedPayment) {
                    await prisma.payment.update({
                        where: { id: updatedPayment.id },
                        data: { status: 'COMPLETED' },
                    });

                    if (updatedPayment.listingId) {
                        await publishPaymentSuccess(updatedPayment.listingId, orderId);
                    }

                    logger.info(`Payment verified and completed for order: ${orderId}`);
                }
            }
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        next(error);
    }
};
