const { eq, isNull } = require('drizzle-orm');
const { db } = require('../server');
const { medicos, usuarios, disponibilidad } = require('../schema');

exports.getMyProfile = async (req, res) => {
    try {
        const doctorResult = await db.select().from(medicos).where(eq(medicos.usuarioId, req.user.id));
        const doctorProfile = doctorResult[0];

        if (!doctorProfile) {
            return res.status(404).json({ message: 'Perfil de médico no encontrado' });
        }

        res.json(doctorProfile);
    } catch (error) {
        console.error('Get Doctor Profile Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { especialidad, numeroLicencia, biografia, precioConsulta, nombreCompleto, telefono } = req.body;

        const doctorResult = await db.select().from(medicos).where(eq(medicos.usuarioId, req.user.id));
        const existingProfile = doctorResult[0];

        // Update Doctor specifics
        if (existingProfile) {
            await db.update(medicos)
                .set({ especialidad, numeroLicencia, biografia, precioConsulta })
                .where(eq(medicos.id, existingProfile.id));
        } else {
            await db.insert(medicos).values({
                usuarioId: req.user.id,
                especialidad,
                numeroLicencia,
                biografia,
                precioConsulta
            });
        }

        // Update User basics (Name, Phone)
        if (nombreCompleto || telefono) {
            await db.update(usuarios)
                .set({ nombreCompleto, telefono })
                .where(eq(usuarios.id, req.user.id));
        }

        const updatedResult = await db.select().from(medicos).where(eq(medicos.usuarioId, req.user.id));
        // Get updated user info too
        const updatedUser = await db.select().from(usuarios).where(eq(usuarios.id, req.user.id));

        res.json({ ...updatedResult[0], ...updatedUser[0] });
    } catch (error) {
        console.error('Update Doctor Profile Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.getAvailability = async (req, res) => {
    try {
        const doctorResult = await db.select().from(medicos).where(eq(medicos.usuarioId, req.user.id));
        const doctor = doctorResult[0];

        if (!doctor) {
            return res.status(404).json({ message: 'Perfil de médico no encontrado' });
        }

        const schedule = await db.select().from(disponibilidad).where(eq(disponibilidad.medicoId, doctor.id));
        res.json(schedule);
    } catch (error) {
        console.error('Get Availability Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.setAvailability = async (req, res) => {
    try {
        const { schedule } = req.body;

        const doctorResult = await db.select().from(medicos).where(eq(medicos.usuarioId, req.user.id));
        const doctor = doctorResult[0];

        if (!doctor) {
            return res.status(404).json({ message: 'Perfil de médico no encontrado' });
        }

        await db.delete(disponibilidad).where(eq(disponibilidad.medicoId, doctor.id));

        if (schedule && schedule.length > 0) {
            const newSlots = schedule.map(slot => ({
                medicoId: doctor.id,
                diaSemana: slot.diaSemana,
                horaInicio: slot.horaInicio,
                horaFin: slot.horaFin
            }));

            await db.insert(disponibilidad).values(newSlots);
        }

        res.json({ message: 'Disponibilidad actualizada', schedule });
    } catch (error) {
        console.error('Set Availability Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const allDoctors = await db.select({
            id: medicos.id,
            especialidad: medicos.especialidad,
            precioConsulta: medicos.precioConsulta,
            nombreCompleto: usuarios.nombreCompleto,
            biografia: medicos.biografia
        })
            .from(medicos)
            .leftJoin(usuarios, eq(medicos.usuarioId, usuarios.id))
            .where(req.user?.clinicaId ? eq(medicos.clinicaId, req.user.clinicaId) : isNull(medicos.clinicaId));

        res.json(allDoctors);
    } catch (error) {
        console.error('Get All Doctors Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.getPublicAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        const schedule = await db.select().from(disponibilidad).where(eq(disponibilidad.medicoId, id));
        res.json(schedule);
    } catch (error) {
        console.error('Get Public Availability Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

