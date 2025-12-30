
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    try {
        await client.connect();
        const sql = fs.readFileSync(path.join(__dirname, 'drizzle', '0004_clinics.sql'), 'utf8');
        await client.query(sql);
        console.log('Migration 0004_clinics applied successfully');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await client.end();
    }
}

migrate();
