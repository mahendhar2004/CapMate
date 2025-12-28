import { Request, Response, NextFunction } from 'express';
import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from '../services/cognito';
import { CONFIG } from '../config';
import { logger } from '@capmate/shared';

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code } = req.body;
        const command = new ConfirmSignUpCommand({
            ClientId: CONFIG.AWS.COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
        });

        await cognitoClient.send(command);
        logger.info(`Email verified for: ${email}`);
        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        next(error);
    }
};
