import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { getRoutines, getRoutine, createRoutine, updateRoutine, deleteRoutine, addStretchToRoutine, removeStretchFromRoutine, reorderStretches } from '../controllers/routineController.js';
import { createRoutineSchema, updateRoutineSchema, addStretchSchema, reorderStretchesSchema } from '../validators/routineValidators.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getRoutines);
router.get('/:id', getRoutine);
router.post('/', validateRequest(createRoutineSchema), createRoutine);
router.put('/:id', validateRequest(updateRoutineSchema), updateRoutine);
router.delete('/:id', deleteRoutine);

router.post('/:id/stretches', validateRequest(addStretchSchema), addStretchToRoutine);
router.delete('/:id/stretches/:routineStretchId', removeStretchFromRoutine);
router.put('/:id/stretches/reorder', validateRequest(reorderStretchesSchema), reorderStretches);

export default router;
