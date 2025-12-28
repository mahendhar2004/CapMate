import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';

export const listListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [listings, total] = await prisma.$transaction([
            prisma.listing.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { seller: { select: { id: true, name: true } } },
            }),
            prisma.listing.count(),
        ]);

        // Privacy filter for list view
        const sanitizedListings = listings.map((listing: any) => {
            if (listing.visibilityMode === 'ANONYMOUS') {
                listing.seller = undefined;
            }
            return listing;
        });

        res.status(200).json({
            data: sanitizedListings,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};
