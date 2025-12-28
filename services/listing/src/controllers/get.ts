import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { AppError } from '@capmate/shared';

export const getListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const listing = await prisma.listing.findUnique({
            where: { id },
            include: { seller: { select: { id: true, name: true, email: true } } }, // Fetch basic seller info
        });

        if (!listing) {
            throw new AppError('Listing not found', 404);
        }

        // Hide seller info if ANONYMOUS
        if (listing.visibilityMode === 'ANONYMOUS') {
            (listing as any).seller = undefined;
        }

        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};
