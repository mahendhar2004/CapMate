import app from './app';
import { CONFIG } from './config';
import { logger } from '@capmate/shared';

import { startSqsConsumer } from './services/consumer';

app.listen(CONFIG.PORT, () => {
    logger.info(`Listing service running on port ${CONFIG.PORT}`);
    startSqsConsumer();
});
