
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function check() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios';
        `);
        console.log('Usuarios columns:', res.rows.map(r => r.column_name));

        const res2 = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log('Tables:', res2.rows.map(r => r.table_name));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

check();
