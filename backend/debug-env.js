require('dotenv').config({ override: true });

console.log('Checking environment variables...');
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL is loaded.');
    console.log('Value starts with:', process.env.DATABASE_URL.substring(0, 20));
    try {
        const urlParts = process.env.DATABASE_URL.split('@')[1].split('/')[0];
        console.log('Host appears to be:', urlParts);
    } catch (e) {
        console.log('Could not parse host from URL');
    }
    // Check for common issues
    if (process.env.DATABASE_URL.includes('"')) {
        console.log('WARNING: DATABASE_URL contains quotes!');
    }
} else {
    console.error('ERROR: DATABASE_URL is NOT loaded.');
}
