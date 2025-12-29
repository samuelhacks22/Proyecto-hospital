const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { eq } = require('drizzle-orm');
const { db } = require('../server');
const { usuarios } = require('../schema');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

exports.register = async (req, res) => {
    try {
        const { email, password, nombreCompleto, telefono, rol } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
        }

        // Check if user exists
        const existingUser = await db.select().from(usuarios).where(eq(usuarios.email, email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const contrasena = await bcrypt.hash(password, salt);

        await db.insert(usuarios).values({
            id: crypto.randomUUID(),
            email,
            contrasena,
            nombreCompleto,
            telefono,
            rol: rol || 'PACIENTE'
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
        const userResult = await db.select().from(usuarios).where(eq(usuarios.email, email));
        const user = userResult[0];

        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.contrasena);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, rol: user.rol }, // Use Spanish key 'rol'
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombreCompleto: user.nombreCompleto,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
