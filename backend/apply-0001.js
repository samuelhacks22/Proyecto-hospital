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

        const sqlPath = path.join(__dirname, 'drizzle', '0001_sour_sleepwalker.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split by breakpoint
        const statements = sqlContent.split('--> statement-breakpoint');

        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 50) + '...');
                await client.query(statement);
            }
        }

        console.log('Migration 0001 applied successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
