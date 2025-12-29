const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { eq } = require('drizzle-orm');
const { db } = require('../server'); // Need to export db from server.js
const { users } = require('../schema');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

exports.register = async (req, res) => {
    try {
        const { email, password, fullName, phone, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
        }

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user (UUID is usually handled by DB default if using gen_random_uuid(), 
        // but in our schema we defined it as 'varchar primary key'. 
        // If it doesn't auto-generate, we need to supply it. 
        // In our migration 0000_clever, ID was varchar NOT NULL without default.
        // Wait, the introspected schema (step 311) had default(gen_random_uuid()).
        // My manual schema (step 315) had 'varchar("id").primaryKey().notNull()'.
        // If the DB has the default, we don't need to send it.
        // Let's assume DB handles it or use crypto.randomUUID() if needed.
        // I'll try inserting without ID first.

        await db.insert(users).values({
            id: crypto.randomUUID(), // Just in case
            email,
            passwordHash,
            fullName,
            phone,
            role: role || 'PACIENTE'
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const userResult = await db.select().from(users).where(eq(users.email, email));
        const user = userResult[0];

        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
