import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { prisma } from "./db";
import { CONFIG } from "../config";
import { logger } from "@capmate/shared";

export const sqsClient = new SQSClient({
    region: CONFIG.AWS.REGION,
});

export const startSqsConsumer = async () => {
    logger.info('Starting SQS Consumer for payment updates...');

    while (true) {
        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: CONFIG.AWS.SQS_QUEUE_URL,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 20, // Long polling
            });

            const response = await sqsClient.send(command);

            if (response.Messages && response.Messages.length > 0) {
                for (const message of response.Messages) {
                    if (!message.Body) continue;

                    const { listingId, status } = JSON.parse(message.Body);
                    logger.info(`Received payment update: ${listingId} -> ${status}`);

                    if (status === 'COMPLETED') {
                        await prisma.listing.update({
                            where: { id: listingId },
                            data: { status: 'ACTIVE' }, // Or SOLD depending on business logic? "set status = ACTIVE" as per request.
                        });
                        logger.info(`Listing ${listingId} activated.`);
                    }

                    // Delete processed message
                    await sqsClient.send(new DeleteMessageCommand({
                        QueueUrl: CONFIG.AWS.SQS_QUEUE_URL,
                        ReceiptHandle: message.ReceiptHandle,
                    }));
                }
            }
        } catch (error) {
            logger.error('Error in SQS Consumer', { error });
            // Wait a bit before retrying to avoid spamming logs on transient failures
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};
