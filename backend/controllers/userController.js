const { eq } = require('drizzle-orm');
const { db } = require('../server');
const { usuarios } = require('../schema');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        // req.user.id comes from authMiddleware
        const userResult = await db.select().from(usuarios).where(eq(usuarios.id, req.user.id));
        const user = userResult[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Exclude contrasena
        const { contrasena, ...userProfile } = user;
        res.json(userProfile);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { nombreCompleto, telefono, cedula } = req.body;

        // Update fields
        await db.update(usuarios)
            .set({
                nombreCompleto,
                telefono,
                cedula
            })
            .where(eq(usuarios.id, req.user.id));

        // Fetch updated user
        const userResult = await db.select().from(usuarios).where(eq(usuarios.id, req.user.id));
        const updatedUser = userResult[0];

        const { contrasena, ...userProfile } = updatedUser;
        res.json(userProfile);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
// [ADMIN] Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        let query = db.select().from(usuarios);

        // If the admin belongs to a clinic, only show users of that clinic
        if (req.user.clinicaId) {
            query = query.where(eq(usuarios.clinicaId, req.user.clinicaId));
        }

        const allUsers = await query;
        // Exclude passwords
        const safeUsers = allUsers.map(u => {
            const { contrasena, ...rest } = u;
            return rest;
        });
        res.json(safeUsers);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// [ADMIN] Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Optional: Add logic to cascade delete or prevent deletion if they have appointments
        // For now, we rely on DB cascade or manual cleanup. 
        // NOTE: Our Seed script used CASCADE in cleaning, but schema might not have it defined.
        // Let's assume basic deletion for now.

        await db.delete(usuarios).where(eq(usuarios.id, id));
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Error al eliminar usuario (posiblemente tenga datos relacionados)' });
    }
};
