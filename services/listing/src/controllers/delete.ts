import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { AppError, logger } from '@capmate/shared';

export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user.sub;

        const listing = await prisma.listing.findUnique({ where: { id } });

        if (!listing) {
            throw new AppError('Listing not found', 404);
        }

        if (listing.sellerId !== userId) {
            throw new AppError('Unauthorized', 403);
        }

        await prisma.listing.delete({ where: { id } });

        logger.info(`Listing deleted: ${id}`);
        res.status(200).json({ message: 'Listing deleted' });
    } catch (error) {
        next(error);
    }
};
