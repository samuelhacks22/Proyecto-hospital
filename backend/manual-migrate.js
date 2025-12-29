const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    console.log('Loading .env file...');
    const result = require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
    if (result.error) {
        console.error('Error loading .env:', result.error);
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL is missing!');
        process.exit(1);
    }

    console.log('DATABASE_URL found:', dbUrl.replace(/:[^:@]*@/, ':****@')); // Mask password

    const client = new Client({
        connectionString: dbUrl, // Use raw URL with params
        ssl: true, // Enable SSL wrapper
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        const sqlPath = path.join(__dirname, 'drizzle', '0000_clever_blink.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split by breakpoint
        const statements = sqlContent.split('--> statement-breakpoint');

        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 50) + '...');
                await client.query(statement);
            }
        }

        console.log('Manual migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
