import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { CONFIG } from "../config";
import { logger } from "@capmate/shared";

export const sqsClient = new SQSClient({
    region: CONFIG.AWS.REGION,
});

export const publishPaymentSuccess = async (listingId: string, orderId: string) => {
    try {
        const command = new SendMessageCommand({
            QueueUrl: CONFIG.AWS.SQS_QUEUE_URL,
            MessageBody: JSON.stringify({ listingId, orderId, status: 'COMPLETED' }),
        });

        await sqsClient.send(command);
        logger.info(`Published payment success event for listing: ${listingId}`);
    } catch (error) {
        logger.error('Failed to publish to SQS', { error });
    }
};
