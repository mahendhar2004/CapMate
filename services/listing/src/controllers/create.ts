import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { logger } from '@capmate/shared';

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, price, images, category, condition, visibilityMode } = req.body;
        const sellerId = req.user.sub; // From JWT

        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                price,
                images,
                category,
                condition,
                visibilityMode,
                sellerId,
            },
        });

        logger.info(`Listing created: ${listing.id} by ${sellerId}`);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};
