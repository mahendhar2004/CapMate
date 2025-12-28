import { Router } from 'express';
import { getPresignedUrl } from './controllers/upload';
import { validateToken } from '@capmate/shared';
import { CONFIG } from './config';

import { createListing } from './controllers/create';
import { listListings } from './controllers/list';
import { getListing } from './controllers/get';
import { updateListing } from './controllers/update';
import { deleteListing } from './controllers/delete';

const router = Router();

// Protect all routes with JWT validation
router.use(validateToken(CONFIG.AWS.REGION, CONFIG.AWS.COGNITO_USER_POOL_ID));

router.post('/presigned-url', getPresignedUrl);

// CRUD Routes
router.post('/', createListing);
router.get('/', listListings);
router.get('/:id', getListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;
