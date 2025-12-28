import { Router } from 'express';
import { createOrder } from './controllers/createOrder';
import { handleWebhook } from './controllers/webhook';
import { validateToken } from '@capmate/shared';

import { CONFIG } from './config';

const router = Router();

// Public Webhook route (protected by signature, not JWT)
router.post('/webhook', handleWebhook);

// Protect other routes
router.use(validateToken(CONFIG.AWS.REGION, CONFIG.AWS.COGNITO_USER_POOL_ID));

router.post('/orders/create', createOrder);

export default router;
