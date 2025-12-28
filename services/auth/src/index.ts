import app from './app';
import { CONFIG } from './config';
import { logger } from '@capmate/shared';

app.listen(CONFIG.PORT, () => {
    logger.info(`Auth service running on port ${CONFIG.PORT}`);
});
