const { eq, and, ne } = require('drizzle-orm');
const { db } = require('../server');
const { citas, medicos, usuarios } = require('../schema');

exports.createAppointment = async (req, res) => {
    try {
        const { medicoId, fecha, horaInicio, tipo, notas } = req.body;
        const pacienteId = req.user.id;

        const doctorResult = await db.select().from(medicos).where(eq(medicos.id, medicoId));
        if (doctorResult.length === 0) {
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        const existing = await db.select().from(citas).where(
            and(
                eq(citas.medicoId, medicoId),
                eq(citas.fecha, fecha),
                eq(citas.horaInicio, horaInicio),
                ne(citas.estado, 'CANCELADA')
            )
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Horario no disponible' });
        }

        await db.insert(citas).values({
            pacienteId,
            medicoId,
            fecha,
            horaInicio,
            tipo: tipo || 'VIRTUAL',
            notas,
            estado: 'PENDIENTE'
        });

        res.status(201).json({ message: 'Cita reservada exitosamente' });
    } catch (error) {
        console.error('Create Appointment Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const rol = req.user.rol;

        if (rol === 'MEDICO') {
            const doctorRes = await db.select().from(medicos).where(eq(medicos.usuarioId, userId));
            if (doctorRes.length === 0) {
                return res.json([]);
            }
            const medicoId = doctorRes[0].id;

            const results = await db.select({
                id: citas.id,
                fecha: citas.fecha,
                horaInicio: citas.horaInicio,
                estado: citas.estado,
                tipo: citas.tipo,
                nombrePaciente: usuarios.nombreCompleto,
                enlaceReunion: citas.enlaceReunion
            })
                .from(citas)
                .leftJoin(usuarios, eq(citas.pacienteId, usuarios.id))
                .where(eq(citas.medicoId, medicoId));

            return res.json(results);

        } else {
            const results = await db.select({
                id: citas.id,
                fecha: citas.fecha,
                horaInicio: citas.horaInicio,
                estado: citas.estado,
                tipo: citas.tipo,
                nombreMedico: usuarios.nombreCompleto,
                especialidad: medicos.especialidad,
                enlaceReunion: citas.enlaceReunion
            })
                .from(citas)
                .leftJoin(medicos, eq(citas.medicoId, medicos.id))
                .leftJoin(usuarios, eq(medicos.usuarioId, usuarios.id))
                .where(eq(citas.pacienteId, userId));

            return res.json(results);
        }

    } catch (error) {
        console.error('Get Appointments Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
