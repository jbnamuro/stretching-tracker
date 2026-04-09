import { prisma } from '../config/db.js';

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
    getRoutines, getRoutine, createRoutine, updateRoutine, deleteRoutine,
    addStretchToRoutine, removeStretchFromRoutine, reorderStretches
};
