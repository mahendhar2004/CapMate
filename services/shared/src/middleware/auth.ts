import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { AppError } from '../errors/AppError';
import logger from '../logger';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const validateToken = (region: string, userPoolId: string) => {
    const client = jwksRsa({
        jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
    });

    const getKey = (header: any, callback: any) => {
        client.getSigningKey(header.kid, (err, key) => {
            if (err) {
                callback(err, null);
            } else {
                const signingKey = key?.getPublicKey();
                callback(null, signingKey);
            }
        });
    };

    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new AppError('Unauthorized: No token provided', 401));
        }

        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                logger.error('Token verification failed', { error: err.message });
                return next(new AppError('Unauthorized: Invalid token', 401));
            }
            req.user = decoded;
            next();
        });
    };
};
