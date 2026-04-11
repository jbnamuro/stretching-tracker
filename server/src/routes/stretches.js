import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { getStretches, getStretch, createStretch, updateStretch, deleteStretch } from '../controllers/stretchController.js';
import { createStretchSchema, updateStretchSchema } from '../validators/stretchValidators.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getStretches);
router.get('/:id', getStretch);
router.post('/', validateRequest(createStretchSchema), createStretch);
router.put('/:id', validateRequest(updateStretchSchema), updateStretch);
router.delete('/:id', deleteStretch);

export default router;
