import { Request, Response, NextFunction } from 'express';
import { InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from '../services/cognito';
import { CONFIG } from '../config';
import { logger } from '@capmate/shared';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        const command = new InitiateAuthCommand({
            ClientId: CONFIG.AWS.COGNITO_CLIENT_ID,
            AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
            AuthParameters: { REFRESH_TOKEN: refreshToken },
        });

        const response = await cognitoClient.send(command);
        logger.info(`Token refreshed`);
        res.status(200).json(response.AuthenticationResult);
    } catch (error) {
        next(error);
    }
};
