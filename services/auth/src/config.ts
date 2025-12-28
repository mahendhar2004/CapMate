import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 3001,
    AWS: {
        REGION: process.env.AWS_REGION || 'us-east-1',
        COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
    }
};
