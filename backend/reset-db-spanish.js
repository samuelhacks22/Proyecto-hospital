require('dotenv').config({ override: true });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    const dbUrl = process.env.DATABASE_URL;
    const client = new Client({
        connectionString: dbUrl,
        ssl: true,
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // 1. Drop old tables if they exist
        console.log('Dropping old tables...');
        await client.query('DROP TABLE IF EXISTS "appointments" CASCADE');
        await client.query('DROP TABLE IF EXISTS "availability" CASCADE');
        await client.query('DROP TABLE IF EXISTS "doctors" CASCADE');
        await client.query('DROP TABLE IF EXISTS "users" CASCADE');

        // Drop old types
        await client.query('DROP TYPE IF EXISTS "role" CASCADE');
        await client.query('DROP TYPE IF EXISTS "appointment_status" CASCADE');
        await client.query('DROP TYPE IF EXISTS "appointment_type" CASCADE');

        // 2. Apply new migration
        const sqlPath = path.join(__dirname, 'drizzle', '0002_wise_doctor_spectrum.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        const statements = sqlContent.split('--> statement-breakpoint');

        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 50) + '...');
                await client.query(statement);
            }
        }

        console.log('Database translated to Spanish successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
