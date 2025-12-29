const { eq, and, ne } = require('drizzle-orm');
const { db } = require('../server');
const { appointments, doctors, users } = require('../schema');

// Book Appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, date, startTime, type, notes } = req.body;
        const patientId = req.user.id; // From Auth Middleware

        // 1. Check if Doctor exists
        const doctorResult = await db.select().from(doctors).where(eq(doctors.id, doctorId));
        if (doctorResult.length === 0) {
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        // 2. Check availability/overlap
        // Simple check: Is there an active appointment at this time?
        const existing = await db.select().from(appointments).where(
            and(
                eq(appointments.doctorId, doctorId),
                eq(appointments.date, date),
                eq(appointments.startTime, startTime),
                ne(appointments.status, 'CANCELADA')
            )
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Horario no disponible' });
        }

        // 3. Create Appointment
        await db.insert(appointments).values({
            patientId,
            doctorId,
            date,
            startTime,
            type: type || 'VIRTUAL',
            notes,
            status: 'PENDIENTE'
        });

        res.status(201).json({ message: 'Cita reservada exitosamente' });
    } catch (error) {
        console.error('Create Appointment Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Get My Appointments
exports.getMyAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        if (role === 'MEDICO') {
            // Find Doctor ID first
            const doctorRes = await db.select().from(doctors).where(eq(doctors.userId, userId));
            if (doctorRes.length === 0) {
                return res.json([]); // No profile = no appointments
            }
            const doctorId = doctorRes[0].id;

            // Get appointments for this doctor
            const results = await db.select({
                id: appointments.id,
                date: appointments.date,
                startTime: appointments.startTime,
                status: appointments.status,
                type: appointments.type,
                patientName: users.fullName,
                meetingLink: appointments.meetingLink
            })
                .from(appointments)
                .leftJoin(users, eq(appointments.patientId, users.id))
                .where(eq(appointments.doctorId, doctorId));

            return res.json(results);

        } else {
            // Patient View
            const results = await db.select({
                id: appointments.id,
                date: appointments.date,
                startTime: appointments.startTime,
                status: appointments.status,
                type: appointments.type,
                doctorName: users.fullName, // Doctor's User Name
                specialty: doctors.specialty,
                meetingLink: appointments.meetingLink
            })
                .from(appointments)
                .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
                .leftJoin(users, eq(doctors.userId, users.id))
                .where(eq(appointments.patientId, userId));

            return res.json(results);
        }

    } catch (error) {
        console.error('Get Appointments Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
