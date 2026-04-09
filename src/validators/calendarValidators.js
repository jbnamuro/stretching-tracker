import { z } from 'zod';

export const createCalendarEntrySchema = z.object({
    routineId: z.string().uuid(),
    completedDate: z.string().min(1),
    actualDuration: z.number().int().positive().optional(),
    notes: z.string().optional(),
});

export const updateCalendarEntrySchema = z.object({
    actualDuration: z.number().int().positive().optional(),
    notes: z.string().optional(),
}).partial();
