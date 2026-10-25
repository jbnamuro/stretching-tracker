import express from 'express';
import { login, register, logout, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { registerSchema } from '../validators/authValidators.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', validateRequest(registerSchema), register);
router.post('/logout', logout);
router.get('/me', authMiddleware, getCurrentUser);


export default router;