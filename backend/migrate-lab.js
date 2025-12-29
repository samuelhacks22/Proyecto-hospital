
require('dotenv').config({ override: true });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });

    try {
        await client.connect();
        console.log('Connected to DB...');

        const sqlPath = path.join(__dirname, 'drizzle', '0003_lab_results.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying migration...');
        await client.query(sqlContent);

        console.log('✅ Migration applied successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
