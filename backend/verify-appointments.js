const http = require('http');

// Helper for requests
function request(method, path, data, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;
        if (data) options.headers['Content-Length'] = data.length;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function verify() {
    try {
        const ts = Date.now();

        // 1. Setup Doctor
        console.log('--- 1. Setting up Doctor ---');
        const docEmail = `doc_${ts}@test.com`;
        await request('POST', '/api/auth/register', JSON.stringify({ email: docEmail, password: '123', fullName: 'Dr. Verify', role: 'MEDICO' }));
        const docLogin = await request('POST', '/api/auth/login', JSON.stringify({ email: docEmail, password: '123' }));
        const docToken = docLogin.body.token;
        // Create Profile to get ID
        const docProfile = await request('PUT', '/api/doctors/profile', JSON.stringify({ specialty: 'Test' }), docToken);
        const doctorId = docProfile.body.id;
        console.log('Doctor ID:', doctorId);

        // 2. Setup Patient
        console.log('\n--- 2. Setting up Patient ---');
        const patEmail = `pat_${ts}@test.com`;
        await request('POST', '/api/auth/register', JSON.stringify({ email: patEmail, password: '123', fullName: 'Pat Verify', role: 'PACIENTE' }));
        const patLogin = await request('POST', '/api/auth/login', JSON.stringify({ email: patEmail, password: '123' }));
        const patToken = patLogin.body.token;

        // 3. Book Appointment
        console.log('\n--- 3. Booking Appointment ---');
        const appData = JSON.stringify({
            doctorId,
            date: '2025-01-01',
            startTime: '10:00:00',
            type: 'VIRTUAL'
        });
        const bookRes = await request('POST', '/api/appointments', appData, patToken);
        console.log('Book Status:', bookRes.status, bookRes.body.message);

        // 4. Overlap Check
        console.log('\n--- 4. Checking Overlap ---');
        const bookRes2 = await request('POST', '/api/appointments', appData, patToken);
        console.log('Book 2 Status:', bookRes2.status);
        if (bookRes2.status === 400) console.log('✅ Overlap prevented');
        else console.error('❌ Overlap allowed!');

        // 5. List
        console.log('\n--- 5. Listing Appointments ---');
        const listRes = await request('GET', '/api/appointments', null, patToken);
        console.log('Count:', listRes.body.length);
        if (listRes.body.length > 0 && listRes.body[0].specialty === 'Test') {
            console.log('✅ Appointment listed correctly');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

verify();
