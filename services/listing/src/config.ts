import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 3002,
    AWS: {
        REGION: process.env.AWS_REGION || 'us-east-1',
        S3_BUCKET: process.env.S3_BUCKET || 'capmate-listings',
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
        SQS_QUEUE_URL: process.env.SQS_QUEUE_URL || 'http://localhost:4566/000000000000/payment-updates',
    }
};
