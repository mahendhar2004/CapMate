import { Request, Response, NextFunction } from 'express';
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from '../services/cognito';
import { CONFIG } from '../config';
import { logger } from '@capmate/shared';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const command = new SignUpCommand({
            ClientId: CONFIG.AWS.COGNITO_CLIENT_ID,
            Username: email,
            Password: password,
            UserAttributes: [{ Name: 'email', Value: email }],
        });

        await cognitoClient.send(command);
        logger.info(`User registered: ${email}`);
        res.status(201).json({ message: 'User registered. Please verify email.' });
    } catch (error) {
        next(error);
    }
};
