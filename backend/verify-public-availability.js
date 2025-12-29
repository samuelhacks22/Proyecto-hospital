
const http = require('http');

function request(method, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function verify() {
    try {
        console.log('--- Verifying Public Availability Endpoint ---');

        // 1. Get all doctors to find an ID
        console.log('Fetching doctors...');
        const doctorsRes = await request('GET', '/api/doctors');

        if (doctorsRes.body.length === 0) {
            console.log('⚠️ No doctors found. Cannot verify availability without a doctor.');
            return;
        }

        const doctorId = doctorsRes.body[0].id;
        console.log(`Checking availability for Doctor ID: ${doctorId}`);

        // 2. Get availability
        const availRes = await request('GET', `/api/doctors/${doctorId}/availability`);
        console.log('Status:', availRes.status);
        console.log('Availability:', availRes.body);

        if (availRes.status === 200 && Array.isArray(availRes.body)) {
            console.log('✅ Public Availability Endpoint Works!');
        } else {
            console.error('❌ Endpoint Failed');
        }

    } catch (err) {
        console.error('Verification Error:', err);
    }
}

verify();
