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
        const email = `dr_${Date.now()}@test.com`;
        console.log(`--- 1. Registering Doctor (${email}) ---`);
        const regData = JSON.stringify({ email, password: 'password123', fullName: 'Dr. House', role: 'DOCTOR' });
        await request('POST', '/api/auth/register', regData);

        const loginRes = await request('POST', '/api/auth/login', JSON.stringify({ email, password: 'password123' }));
        const token = loginRes.body.token;
        console.log('Got Token:', !!token);

        console.log('\n--- 2. Create/Update Doctor Profile ---');
        const profileData = JSON.stringify({
            specialty: 'Diagnostic Medicine',
            licenseNumber: 'MD-12345',
            bio: 'It is not lupus.',
            consultationFee: 500
        });
        const updateRes = await request('PUT', '/api/doctors/profile', profileData, token);
        console.log('Specialty:', updateRes.body.specialty);

        if (updateRes.body.specialty === 'Diagnostic Medicine') console.log('✅ Doctor Profile Created');
        else console.error('❌ Profile Creation Failed');

        console.log('\n--- 3. Public Doctor List ---');
        const listRes = await request('GET', '/api/doctors');
        console.log('Doctors Found:', listRes.body.length);
        const found = listRes.body.find(d => d.specialty === 'Diagnostic Medicine');
        if (found) console.log('✅ Found Dr. House in list:', found.fullName);
        else console.error('❌ Doctor not in list');

    } catch (err) {
        console.error('Verification Error:', err);
    }
}

verify();
