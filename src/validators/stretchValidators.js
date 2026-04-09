import { z } from 'zod';

export const createStretchSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    durationSeconds: z.number().int().positive(),
    muscleGroup: z.string().min(1),
    difficulty: z.string().optional(),
    isCustom: z.boolean().optional(),
});

export const updateStretchSchema = createStretchSchema.partial();
