const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function verify() {
    try {
        console.log('--- Registering User ---');
        const registerData = JSON.stringify({
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
            fullName: 'Test User',
            role: 'PATIENT'
        });

        const regRes = await postRequest('/api/auth/register', registerData);
        console.log('Register Status:', regRes.status);
        console.log('Register Body:', regRes.body);

        if (regRes.status !== 201 && regRes.status !== 400) { // 400 if exists is fine for re-runs
            console.error('Registration failed!');
            return;
        }

        console.log('\n--- Logging In ---');
        const loginData = JSON.stringify({
            email: JSON.parse(registerData).email,
            password: 'password123'
        });

        const loginRes = await postRequest('/api/auth/login', loginData);
        console.log('Login Status:', loginRes.status);
        console.log('Login Token Present:', !!loginRes.body.token);

        if (loginRes.status === 200 && loginRes.body.token) {
            console.log('✅ Auth Flow Verified!');
        } else {
            console.error('❌ Login Failed');
        }

    } catch (err) {
        console.error('Verification Error:', err);
    }
}

verify();
