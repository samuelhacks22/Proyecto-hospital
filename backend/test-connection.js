require('dotenv').config({ override: true });
const { Client } = require('pg');

const pooledUrl = process.env.DATABASE_URL;
// Attempt to derive direct URL by removing '-pooler'
// Regex looking for "-pooler" before ".c-3" or similar, or just ".aws.neon.tech"
const directUrl = pooledUrl.replace('-pooler', '');

async function testConnection(name, url) {
    console.log(`Testing ${name} connection...`);
    console.log(`Host: ${url.split('@')[1].split('/')[0]}`);

    const client = new Client({
        connectionString: url,
        ssl: true,
    });

    try {
        await client.connect();
        console.log(`✅ ${name} SUCCESS: Connected!`);
        const res = await client.query('SELECT current_database(), inet_server_addr()');
        console.log('Info:', res.rows[0]);
        await client.end();
        return true;
    } catch (err) {
        console.error(`❌ ${name} FAILED:`, err.message);
        if (err.code) console.error('Code:', err.code);
        try { await client.end(); } catch (e) { }
        return false;
    }
}

async function run() {
    console.log('--- DIAGNOSTIC START ---');
    const poolSuccess = await testConnection('POOLED', pooledUrl);
    console.log('------------------------');
    const directSuccess = await testConnection('DIRECT', directUrl);
    console.log('--- DIAGNOSTIC END ---');
}

run();
