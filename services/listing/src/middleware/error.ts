import { Request, Response, NextFunction } from 'express';
import { AppError, logger } from '@capmate/shared';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, { stack: err.stack });

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
