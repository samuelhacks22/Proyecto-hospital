const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { eq, or } = require('drizzle-orm');
const { db } = require('../server');
const { usuarios } = require('../schema');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

exports.register = async (req, res) => {
    try {
        const { email, password, nombreCompleto, telefono, rol, cedula, nombreClinica, direccionClinica } = req.body;

        if (!email || !password || !cedula) {
            return res.status(400).json({ message: 'El correo, contraseña y cédula son obligatorios' });
        }

        // Check if user exists (by email OR cedula)
        const existingUser = await db.select().from(usuarios)
            .where(or(
                eq(usuarios.email, email),
                eq(usuarios.cedula, cedula)
            ));

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe (email o cédula duplicada)' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const contrasena = await bcrypt.hash(password, salt);

        const userId = crypto.randomUUID();

        // Transactionish logic (manual for now or use db.transaction if available)
        // 1. Create User
        await db.insert(usuarios).values({
            id: userId,
            email,
            contrasena,
            nombreCompleto,
            telefono,
            cedula,
            rol: rol || 'PACIENTE'
        });

        // 2. If Clinic, create Clinic record and update User
        if (rol === 'CLINICA') {
            if (!nombreClinica) {
                return res.status(400).json({ message: 'Nombre de la clínica es obligatorio para cuentas de clínica' });
            }

            const clinicResult = await db.insert(require('../schema').clinicas).values({
                nombre: nombreClinica,
                direccion: direccionClinica,
                adminUsuarioId: userId
            }).returning({ id: require('../schema').clinicas.id });

            const clinicId = clinicResult[0].id;

            // Link User to Clinic (as it belongs to this tenant)
            await db.update(usuarios)
                .set({ clinicaId: clinicId })
                .where(eq(usuarios.id, userId));
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Error del servidor' + error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // 'identifier' can be email OR cedula

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Credenciales incompletas' });
        }

        // Find user by Email OR Cedula
        const userResult = await db.select().from(usuarios)
            .where(or(
                eq(usuarios.email, identifier),
                eq(usuarios.cedula, identifier)
            ));

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
            { id: user.id, rol: user.rol, clinicaId: user.clinicaId }, // Include clinicaId
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                cedula: user.cedula,
                nombreCompleto: user.nombreCompleto,
                rol: user.rol,
                clinicaId: user.clinicaId // Include in response
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
