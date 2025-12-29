require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function verify() {
    try {
        const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        console.log('Tables found:', result.map(r => r.table_name));

        // Check for specific tables
        const requiredTables = ['users', 'doctors', 'availability', 'appointments'];
        const foundTables = result.map(r => r.table_name);

        const missing = requiredTables.filter(t => !foundTables.includes(t));
        if (missing.length > 0) {
            console.error('Missing tables:', missing);
            process.exit(1);
        } else {
            console.log('All required tables found!');
            process.exit(0);
        }
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
}

verify();
