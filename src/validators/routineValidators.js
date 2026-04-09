import { z } from 'zod';

export const createRoutineSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    aiGenerated: z.boolean().optional(),
    totalDuration: z.number().int().nonnegative().optional(),
});

export const updateRoutineSchema = createRoutineSchema.partial();

export const addStretchSchema = z.object({
    stretchId: z.string().uuid(),
    orderIndex: z.number().int().nonnegative(),
    customDuration: z.number().int().positive().optional(),
});

export const reorderStretchesSchema = z.object({
    stretches: z.array(z.object({
        id: z.string().uuid(),
        orderIndex: z.number().int().nonnegative(),
    }))
});
