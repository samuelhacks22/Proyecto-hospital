const http = require('http');

// Helper for requests
function request(method, path, data, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) options.headers['Authorization'] = `Bearer ${token}`;
        if (data) options.headers['Content-Length'] = data.length;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(data);
        req.end();
    });
}

async function verify() {
    try {
        const email = `dr_avail_${Date.now()}@test.com`;
        console.log(`--- 1. Registering Doctor (${email}) ---`);
        const regData = JSON.stringify({ email, password: 'password123', fullName: 'Dr. Time', role: 'DOCTOR' });
        await request('POST', '/api/auth/register', regData);

        // Login
        const loginRes = await request('POST', '/api/auth/login', JSON.stringify({ email, password: 'password123' }));
        const token = loginRes.body.token;

        // Create Profile (required before availability)
        await request('PUT', '/api/doctors/profile', JSON.stringify({ specialty: 'General', consultationFee: 100 }), token);

        console.log('\n--- 2. Setting Availability ---');
        const schedule = [
            { dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00' }, // Monday
            { dayOfWeek: 3, startTime: '10:00:00', endTime: '14:00:00' }  // Wednesday
        ];

        const setRes = await request('PUT', '/api/doctors/availability', JSON.stringify({ schedule }), token);
        console.log('Set Status:', setRes.status);

        console.log('\n--- 3. Fetching Availability ---');
        const getRes = await request('GET', '/api/doctors/availability', null, token);
        console.log('Slots Found:', getRes.body.length);

        if (getRes.body.length === 2 && getRes.body[0].dayOfWeek === 1) {
            console.log('✅ Availability Verified!');
        } else {
            console.error('❌ Verification Failed', getRes.body);
        }

    } catch (err) {
        console.error('Verification Error:', err);
    }
}

verify();
