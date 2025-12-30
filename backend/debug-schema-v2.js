
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function check() {
    try {
        await client.connect();
        console.log("Connected!");

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log('Tables:', res.rows.map(r => r.table_name));

        const res2 = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios';
        `);
        console.log('Usuarios columns:', res2.rows.map(r => r.column_name));

    } catch (err) {
        console.error("ERROR MESSAGE:", err.message);
        console.error("ERROR STACK:", err.stack);
    } finally {
        await client.end();
    }
}

check();
