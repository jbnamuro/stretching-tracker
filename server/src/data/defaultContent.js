export const defaultStretches = [
    { name: "Standing Quad Stretch", description: "Pull one heel toward your glutes.", durationSeconds: 30, muscleGroup: "quadriceps", difficulty: "beginner", isCustom: false },
    { name: "Seated Hamstring Stretch", description: "Reach toward your toes while keeping your spine tall.", durationSeconds: 45, muscleGroup: "hamstrings", difficulty: "beginner", isCustom: false },
    { name: "Hip Flexor Lunge", description: "Sink gently into a lunge to open the hips.", durationSeconds: 40, muscleGroup: "hip flexors", difficulty: "intermediate", isCustom: false },
    { name: "Doorway Chest Stretch", description: "Lean forward to open the chest and shoulders.", durationSeconds: 30, muscleGroup: "chest", difficulty: "beginner", isCustom: false },
    { name: "Cat-Cow Stretch", description: "Alternate arching and rounding the spine.", durationSeconds: 60, muscleGroup: "back", difficulty: "beginner", isCustom: false },
    { name: "Wrist Stretch", description: "Extend the arm and gently pull the fingers back.", durationSeconds: 20, muscleGroup: "forearms", difficulty: "beginner", isCustom: false },
];

export const defaultRoutines = [
    {
        name: "Morning Reset",
        description: "A quick wake-up flow for the hips and back.",
        iconName: "standing",
        stretchNames: ["Standing Quad Stretch", "Hip Flexor Lunge", "Cat-Cow Stretch"],
    },
    {
        name: "Desk Escape",
        description: "A short break to loosen tight posture muscles.",
        iconName: "seated",
        stretchNames: ["Seated Hamstring Stretch", "Doorway Chest Stretch", "Wrist Stretch"],
    },
    {
        name: "Full Body Ease",
        description: "A gentle, all-over flow for a low-energy day.",
        iconName: "leaning",
        stretchNames: ["Standing Quad Stretch", "Seated Hamstring Stretch", "Hip Flexor Lunge", "Cat-Cow Stretch"],
    },
];

export const seedDefaultContent = async (db) => {
    await db.$transaction(async (tx) => {
        const existingStretches = await tx.stretch.findMany({
            where: {
                userId: null,
                name: { in: defaultStretches.map(({ name }) => name) },
            },
        });
        const stretchesByName = new Map(existingStretches.map((stretch) => [stretch.name, stretch]));

        for (const stretch of defaultStretches) {
            if (!stretchesByName.has(stretch.name)) {
                const createdStretch = await tx.stretch.create({
                    data: { ...stretch, userId: null },
                });
                stretchesByName.set(createdStretch.name, createdStretch);
            }
        }

        const existingRoutines = await tx.routine.findMany({
            where: {
                userId: null,
                name: { in: defaultRoutines.map(({ name }) => name) },
            },
            select: { name: true },
        });
        const existingRoutineNames = new Set(existingRoutines.map(({ name }) => name));

        for (const routine of defaultRoutines) {
            if (existingRoutineNames.has(routine.name)) {
                continue;
            }

            const routineStretches = routine.stretchNames.map((name) => stretchesByName.get(name));
            if (routineStretches.some((stretch) => !stretch)) {
                throw new Error(`Missing starter stretch for routine "${routine.name}"`);
            }

            await tx.routine.create({
                data: {
                    userId: null,
                    name: routine.name,
                    description: routine.description,
                    iconName: routine.iconName,
                    totalDuration: routineStretches.reduce((total, stretch) => total + stretch.durationSeconds, 0),
                    routineStretches: {
                        create: routineStretches.map((stretch, orderIndex) => ({
                            stretchId: stretch.id,
                            orderIndex,
                        })),
                    },
                },
            });
        }
    });
};
