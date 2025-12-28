import { Request, Response, NextFunction } from 'express';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../services/s3';
import { CONFIG } from '../config';
import { logger } from '@capmate/shared';

export const getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileType } = req.body; // e.g., 'image/jpeg'
        const fileName = `${uuidv4()}.${fileType.split('/')[1]}`;
        const key = `listings/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: CONFIG.AWS.S3_BUCKET,
            Key: key,
            ContentType: fileType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        logger.info(`Generated presigned URL for key: ${key}`);

        res.status(200).json({
            url,
            key,
        });
    } catch (error) {
        next(error);
    }
};
