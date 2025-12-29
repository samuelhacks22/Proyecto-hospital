const { eq } = require('drizzle-orm');
const { db } = require('../server');
const { doctors, users, availability } = require('../schema');

// Get Doctor Profile (Public or Private?)
// For now, private for the doctor themselves, or public for patients to see.
// Let's implement 'getMyProfile' first.

exports.getMyProfile = async (req, res) => {
    try {
        // Check if doctor profile exists for this user
        const doctorResult = await db.select().from(doctors).where(eq(doctors.userId, req.user.id));
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

// Create/Update Doctor Profile
exports.updateProfile = async (req, res) => {
    try {
        const { specialty, licenseNumber, bio, consultationFee } = req.body;

        // Check if profile exists
        const doctorResult = await db.select().from(doctors).where(eq(doctors.userId, req.user.id));
        const existingProfile = doctorResult[0];

        if (existingProfile) {
            // Update
            await db.update(doctors)
                .set({ specialty, licenseNumber, bio, consultationFee })
                .where(eq(doctors.id, existingProfile.id));
        } else {
            // Create
            await db.insert(doctors).values({
                userId: req.user.id,
                specialty,
                licenseNumber,
                bio,
                consultationFee
            });
        }

        // Return updated profile
        const updatedResult = await db.select().from(doctors).where(eq(doctors.userId, req.user.id));
        res.json(updatedResult[0]);
    } catch (error) {
        console.error('Update Doctor Profile Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Get Doctor Availability
exports.getAvailability = async (req, res) => {
    try {
        // Determine doctorId from userId
        const doctorResult = await db.select().from(doctors).where(eq(doctors.userId, req.user.id));
        const doctor = doctorResult[0];

        if (!doctor) {
            return res.status(404).json({ message: 'Perfil de médico no encontrado' });
        }

        const schedule = await db.select().from(availability).where(eq(availability.doctorId, doctor.id));
        res.json(schedule);
    } catch (error) {
        console.error('Get Availability Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Set Availability (Replace all)
exports.setAvailability = async (req, res) => {
    try {
        const { schedule } = req.body; // Array of { dayOfWeek, startTime, endTime }

        // 1. Get Doctor ID
        const doctorResult = await db.select().from(doctors).where(eq(doctors.userId, req.user.id));
        const doctor = doctorResult[0];

        if (!doctor) {
            return res.status(404).json({ message: 'Perfil de médico no encontrado' });
        }

        // 2. Clear existing availability
        await db.delete(availability).where(eq(availability.doctorId, doctor.id));

        // 3. Insert new schedule
        if (schedule && schedule.length > 0) {
            const newSlots = schedule.map(slot => ({
                doctorId: doctor.id,
                dayOfWeek: slot.dayOfWeek,
                startTime: slot.startTime,
                endTime: slot.endTime
            }));

            await db.insert(availability).values(newSlots);
        }

        res.json({ message: 'Disponibilidad actualizada', schedule });
    } catch (error) {
        console.error('Set Availability Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Get All Doctors (Public for Patients)
exports.getAllDoctors = async (req, res) => {
    try {
        // Join with Users to get name
        const allDoctors = await db.select({
            id: doctors.id,
            specialty: doctors.specialty,
            consultationFee: doctors.consultationFee,
            fullName: users.fullName,
            bio: doctors.bio
        })
            .from(doctors)
            .leftJoin(users, eq(doctors.userId, users.id));

        res.json(allDoctors);
    } catch (error) {
        console.error('Get All Doctors Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
