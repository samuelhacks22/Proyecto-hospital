
require('dotenv').config({ override: true });
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Helper to hash passwords
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });

    try {
        await client.connect();
        console.log('Connected to DB for seeding...');

        // 1. Clean existing data (Optional: comment out if you want to append)
        console.log('Cleaning existing data...');
        await client.query('DELETE FROM citas');
        await client.query('DELETE FROM disponibilidad');
        await client.query('DELETE FROM medicos');
        await client.query('DELETE FROM usuarios');

        const password = await hashPassword('123456');

        // 2. Create Users
        console.log('Creating Users...');

        const adminId = uuidv4();
        const clinicId = uuidv4();
        const doctor1Id = uuidv4();
        const doctor2Id = uuidv4();
        const patient1Id = uuidv4();
        const patient2Id = uuidv4();

        // Admin
        await client.query(`
            INSERT INTO usuarios (id, email, contrasena, nombre_completo, rol, telefono, cedula)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [adminId, 'admin@plataforma.com', password, 'Administrador Principal', 'ADMIN', '555-0000', 'ADMIN-001']);

        // Clinic
        await client.query(`
            INSERT INTO usuarios (id, email, contrasena, nombre_completo, rol, telefono, cedula)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [clinicId, 'clinica@central.com', password, 'Clínica Central', 'CLINICA', '555-1000', 'CLINIC-001']);

        // Doctor 1
        await client.query(`
            INSERT INTO usuarios (id, email, contrasena, nombre_completo, rol, telefono, cedula)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [doctor1Id, 'doctor@plataforma.com', password, 'Dr. Juan Pérez', 'MEDICO', '555-2000', 'MED-001']);

        // Doctor 2
        await client.query(`
            INSERT INTO usuarios (id, email, contrasena, nombre_completo, rol, telefono, cedula)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [doctor2Id, 'ana@plataforma.com', password, 'Dra. Ana López', 'MEDICO', '555-2001', 'MED-002']);

        // Patient 1
        await client.query(`
            INSERT INTO usuarios (id, email, contrasena, nombre_completo, rol, telefono, cedula)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [patient1Id, 'paciente@plataforma.com', password, 'Carlos Paciente', 'PACIENTE', '555-3000', 'PAC-001']);

        // Patient 2
        await client.query(`
            INSERT INTO usuarios (id, email, contrasena, nombre_completo, rol, telefono, cedula)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [patient2Id, 'maria@plataforma.com', password, 'María Paciente', 'PACIENTE', '555-3001', 'PAC-002']);


        // 3. Create Doctor Profiles
        console.log('Creating Doctor Profiles...');

        // Doctor 1 Profile
        const resDoc1 = await client.query(`
            INSERT INTO medicos (usuario_id, especialidad, numero_licencia, biografia, precio_consulta, verificado)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `, [doctor1Id, 'Cardiología', 'L-12345', 'Especialista en corazón con 10 años de experiencia.', 100, true]);
        const doc1DbId = resDoc1.rows[0].id;

        // Doctor 2 Profile
        const resDoc2 = await client.query(`
            INSERT INTO medicos (usuario_id, especialidad, numero_licencia, biografia, precio_consulta, verificado)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `, [doctor2Id, 'Pediatría', 'L-67890', 'Cuidado integral para niños y adolescentes.', 80, true]);
        const doc2DbId = resDoc2.rows[0].id;


        // 4. Create Availability
        console.log('Setting Availability...');
        // Dr. Juan: Mon (1) 09-17, Wed (3) 09-13
        await client.query(`
            INSERT INTO disponibilidad (medico_id, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4)
        `, [doc1DbId, 1, '09:00:00', '17:00:00']);
        await client.query(`
            INSERT INTO disponibilidad (medico_id, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4)
        `, [doc1DbId, 3, '09:00:00', '13:00:00']);

        // Dra. Ana: Tue (2) 10-18, Thu (4) 10-18
        await client.query(`
            INSERT INTO disponibilidad (medico_id, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4)
        `, [doc2DbId, 2, '10:00:00', '18:00:00']);
        await client.query(`
            INSERT INTO disponibilidad (medico_id, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4)
        `, [doc2DbId, 4, '10:00:00', '18:00:00']);


        // 5. Create Appointments
        console.log('Creating Sample Appointments...');

        // Appointment 1: Patient 1 with Doctor 1 (Today + 1 day)
        const date1 = new Date();
        date1.setDate(date1.getDate() + 1);
        const dateString1 = date1.toISOString().split('T')[0];

        await client.query(`
            INSERT INTO citas (paciente_id, medico_id, fecha, hora_inicio, estado, tipo, notas)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [patient1Id, doc1DbId, dateString1, '10:00:00', 'PENDIENTE', 'VIRTUAL', 'Chequeo general']);

        // Appointment 2: Patient 2 with Doctor 2 (Today + 2 days)
        const date2 = new Date();
        date2.setDate(date2.getDate() + 2);
        const dateString2 = date2.toISOString().split('T')[0];

        await client.query(`
            INSERT INTO citas (paciente_id, medico_id, fecha, hora_inicio, estado, tipo, notas, enlace_reunion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [patient2Id, doc2DbId, dateString2, '11:00:00', 'CONFIRMADA', 'VIRTUAL', 'Fiebre persistente', 'https://meet.google.com/abc-defg-hij']);

        console.log('✅ Seeding completed successfully!');
        console.log('Users created (Password: 123456):');
        console.log('- admin@plataforma.com (ADMIN)');
        console.log('- clinica@central.com (CLINICA)');
        console.log('- doctor@plataforma.com (MEDICO)');
        console.log('- ana@plataforma.com (MEDICO)');
        console.log('- paciente@plataforma.com (PACIENTE)');
        console.log('- maria@plataforma.com (PACIENTE)');

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await client.end();
    }
}

run();
