import { prisma } from '../config/db.js';

const getCalendarEntries = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const where = { userId: '2807ef65-e5d0-49d2-9058-bc9ec2d62d13' }; // TODO: restore req.user.id
        if (startDate || endDate) {
            where.completedDate = {};
            if (startDate) where.completedDate.gte = new Date(startDate);
            if (endDate) where.completedDate.lte = new Date(endDate);
        }
        const entries = await prisma.calendarEntry.findMany({
            where,
            include: { routine: true },
            orderBy: { completedDate: 'desc' }
        });
        res.status(200).json({ status: "success", data: { entries } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getCalendarEntry = async (req, res) => {
    try {
        const entry = await prisma.calendarEntry.findUnique({
            where: { id: req.params.id },
            include: { routine: true }
        });
        if (!entry || entry.userId !== req.user.id) {
            return res.status(404).json({ message: "Calendar entry not found" });
        }
        res.status(200).json({ status: "success", data: { entry } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const createCalendarEntry = async (req, res) => {
    try {
        const { routineId, completedDate, actualDuration, notes } = req.body;
        const routine = await prisma.routine.findUnique({ where: { id: routineId } });
        if (!routine || routine.userId !== req.user.id) {
            return res.status(404).json({ message: "Routine not found" });
        }
        const entry = await prisma.calendarEntry.create({
            data: {
                userId: req.user.id,
                routineId,
                completedDate: new Date(completedDate),
                actualDuration,
                notes
            },
            include: { routine: true }
        });
        res.status(201).json({ status: "success", data: { entry } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateCalendarEntry = async (req, res) => {
    try {
        const existing = await prisma.calendarEntry.findUnique({
            where: { id: req.params.id }
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(404).json({ message: "Calendar entry not found" });
        }
        const entry = await prisma.calendarEntry.update({
            where: { id: req.params.id },
            data: req.body,
            include: { routine: true }
        });
        res.status(200).json({ status: "success", data: { entry } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteCalendarEntry = async (req, res) => {
    try {
        const existing = await prisma.calendarEntry.findUnique({
            where: { id: req.params.id }
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(404).json({ message: "Calendar entry not found" });
        }
        await prisma.calendarEntry.delete({ where: { id: req.params.id } });
        res.status(200).json({ status: "success", message: "Calendar entry deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export { getCalendarEntries, getCalendarEntry, createCalendarEntry, updateCalendarEntry, deleteCalendarEntry };
