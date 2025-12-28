import { Router } from 'express';
import { register } from './controllers/register';
import { verifyEmail } from './controllers/verify';
import { login } from './controllers/login';
import { refreshToken } from './controllers/refresh';

const router = Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

export default router;
