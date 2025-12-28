import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { AppError, logger } from '@capmate/shared';

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
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

        const updatedListing = await prisma.listing.update({
            where: { id },
            data: req.body,
        });

        logger.info(`Listing updated: ${id}`);
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};
