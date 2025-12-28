import { S3Client } from "@aws-sdk/client-s3";
import { CONFIG } from "../config";

export const s3Client = new S3Client({
    region: CONFIG.AWS.REGION,
});
