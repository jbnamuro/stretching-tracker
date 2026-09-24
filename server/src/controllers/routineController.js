import { prisma } from '../config/db.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const getRoutines = async (req, res) => {
    try {
        const routines = await prisma.routine.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ status: "success", data: { routines } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getRoutine = async (req, res) => {
    try {
        const routine = await prisma.routine.findUnique({
            where: { id: req.params.id },
            include: {
                routineStretches: {
                    include: { stretch: true },
                    orderBy: { orderIndex: 'asc' }
                }
            }
        });
        if (!routine || routine.userId !== req.user.id) {
            return res.status(404).json({ message: "Routine not found" });
        }
        res.status(200).json({ status: "success", data: { routine } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const generateRoutine = async (req, res) => {
    try {
        const prompt = req.body.prompt?.trim();
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" });
        }

        const stretches = await prisma.stretch.findMany({
            where: { userId: req.user.id },
            orderBy: { name: 'asc' },
        });

        if (stretches.length === 0) {
            return res.status(400).json({ message: "Create stretches before generating a routine" });
        }

        const availableStretches = stretches.map(({ id, name, description, durationSeconds, muscleGroup, difficulty }) => ({
            id,
            name,
            description,
            durationSeconds,
            muscleGroup,
            difficulty,
        }));

        const message = await anthropic.messages.create({
            model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
            max_tokens: 500,
            system: 'Return only valid JSON. Choose stretches only from the provided list.',
            messages: [{
                role: 'user',
                content: `User request: ${prompt}\n\nAvailable stretches:\n${JSON.stringify(availableStretches)}`,
            }],
        });

        const text = message.content.find((item) => item.type === 'text')?.text;
        if (!text) {
            return res.status(502).json({ message: "Anthropic returned no routine" });
        }

        const generated = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ''));
        const selectedStretches = generated.stretchIds?.map((id) => stretches.find((stretch) => stretch.id === id));

        if (!generated.name || !generated.description || !selectedStretches?.length || selectedStretches.some((stretch) => !stretch)) {
            return res.status(502).json({ message: "Anthropic returned invalid routine data" });
        }

        const totalDuration = selectedStretches.reduce((total, stretch) => total + stretch.durationSeconds, 0);
        const routine = await prisma.routine.create({
            data: {
                userId: req.user.id,
                name: generated.name,
                description: generated.description,
                aiGenerated: true,
                totalDuration,
                routineStretches: {
                    create: selectedStretches.map((stretch, orderIndex) => ({
                        stretchId: stretch.id,
                        orderIndex,
                    })),
                },
            },
            include: { routineStretches: { include: { stretch: true }, orderBy: { orderIndex: 'asc' } } },
        });

        res.status(201).json({ status: "success", data: { routine } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Routine generation failed" });
    }
};

const createRoutine = async (req, res) => {
    try {
        const routine = await prisma.routine.create({
            data: { ...req.body, userId: req.user.id }
        });
        res.status(201).json({ status: "success", data: { routine } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateRoutine = async (req, res) => {
    try {
        const existing = await prisma.routine.findUnique({
            where: { id: req.params.id }
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(404).json({ message: "Routine not found" });
        }
        const routine = await prisma.routine.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.status(200).json({ status: "success", data: { routine } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteRoutine = async (req, res) => {
    try {
        const existing = await prisma.routine.findUnique({
            where: { id: req.params.id }
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(404).json({ message: "Routine not found" });
        }
        await prisma.routine.delete({ where: { id: req.params.id } });
        res.status(200).json({ status: "success", message: "Routine deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const addStretchToRoutine = async (req, res) => {
    try {
        const routine = await prisma.routine.findUnique({
            where: { id: req.params.id }
        });
        if (!routine || routine.userId !== req.user.id) {
            return res.status(404).json({ message: "Routine not found" });
        }
        const { stretchId, orderIndex, customDuration } = req.body;
        const routineStretch = await prisma.routineStretch.create({
            data: { routineId: req.params.id, stretchId, orderIndex, customDuration },
            include: { stretch: true }
        });
        res.status(201).json({ status: "success", data: { routineStretch } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const removeStretchFromRoutine = async (req, res) => {
    try {
        const routine = await prisma.routine.findUnique({
            where: { id: req.params.id }
        });
        if (!routine || routine.userId !== req.user.id) {
            return res.status(404).json({ message: "Routine not found" });
        }
        const routineStretch = await prisma.routineStretch.findUnique({
            where: { id: req.params.routineStretchId }
        });
        if (!routineStretch || routineStretch.routineId !== req.params.id) {
            return res.status(404).json({ message: "Routine stretch not found" });
        }
        await prisma.routineStretch.delete({ where: { id: req.params.routineStretchId } });
        res.status(200).json({ status: "success", message: "Stretch removed from routine" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const reorderStretches = async (req, res) => {
    try {
        const routine = await prisma.routine.findUnique({
            where: { id: req.params.id }
        });
        if (!routine || routine.userId !== req.user.id) {
            return res.status(404).json({ message: "Routine not found" });
        }
        const updates = req.body.stretches.map(({ id, orderIndex }) =>
            prisma.routineStretch.update({ where: { id }, data: { orderIndex } })
        );
        await prisma.$transaction(updates);
        const routineStretches = await prisma.routineStretch.findMany({
            where: { routineId: req.params.id },
            include: { stretch: true },
            orderBy: { orderIndex: 'asc' }
        });
        res.status(200).json({ status: "success", data: { routineStretches } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
    getRoutines, getRoutine, generateRoutine, createRoutine, updateRoutine, deleteRoutine,
    addStretchToRoutine, removeStretchFromRoutine, reorderStretches
};
