const { eq } = require('drizzle-orm');
const { db } = require('../server');
const { users } = require('../schema');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        // req.user.id comes from authMiddleware
        const userResult = await db.select().from(users).where(eq(users.id, req.user.id));
        const user = userResult[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Exclude passwordHash
        const { passwordHash, ...userProfile } = user;
        res.json(userProfile);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phone, cedula } = req.body;

        // Update fields
        await db.update(users)
            .set({
                fullName,
                phone,
                cedula
            })
            .where(eq(users.id, req.user.id));

        // Fetch updated user
        const userResult = await db.select().from(users).where(eq(users.id, req.user.id));
        const updatedUser = userResult[0];

        const { passwordHash, ...userProfile } = updatedUser;
        res.json(userProfile);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
