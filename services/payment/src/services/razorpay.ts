import Razorpay from 'razorpay';
import { CONFIG } from '../config';

export const razorpay = new Razorpay({
    key_id: CONFIG.RAZORPAY.KEY_ID,
    key_secret: CONFIG.RAZORPAY.KEY_SECRET,
});
