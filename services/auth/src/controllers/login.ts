import { Request, Response, NextFunction } from 'express';
import { InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from '../services/cognito';
import { CONFIG } from '../config';
import { logger } from '@capmate/shared';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const command = new InitiateAuthCommand({
            ClientId: CONFIG.AWS.COGNITO_CLIENT_ID,
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            AuthParameters: { USERNAME: email, PASSWORD: password },
        });

        const response = await cognitoClient.send(command);
        logger.info(`User logged in: ${email}`);
        res.status(200).json(response.AuthenticationResult);
    } catch (error) {
        next(error);
    }
};
