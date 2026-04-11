import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { getCalendarEntries, getCalendarEntry, createCalendarEntry, updateCalendarEntry, deleteCalendarEntry } from '../controllers/calendarController.js';
import { createCalendarEntrySchema, updateCalendarEntrySchema } from '../validators/calendarValidators.js';

const router = express.Router();

// router.use(authMiddleware);

router.get('/', getCalendarEntries);
router.get('/:id', getCalendarEntry);
router.post('/', validateRequest(createCalendarEntrySchema), createCalendarEntry);
router.put('/:id', validateRequest(updateCalendarEntrySchema), updateCalendarEntry);
router.delete('/:id', deleteCalendarEntry);

export default router;
