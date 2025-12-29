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
        console.log('--- 1. Logging In ---');
        const loginData = JSON.stringify({ email: 'test@example.com', password: 'password123' });
        const loginRes = await request('POST', '/api/auth/login', loginData);

        if (!loginRes.body.token) {
            // Try registering if login fails (first run cleanup?)
            console.log('Login failed, trying to register...');
            const regData = JSON.stringify({ email: 'test@example.com', password: 'password123', fullName: 'Test User' });
            await request('POST', '/api/auth/register', regData);
            // Login again
            const retryLogin = await request('POST', '/api/auth/login', loginData);
            loginRes.body = retryLogin.body;
        }

        const token = loginRes.body.token;
        if (!token) {
            console.error('❌ Could not get token.');
            return;
        }
        console.log('✅ Logged in.');

        console.log('\n--- 2. Get Profile ---');
        const profileRes = await request('GET', '/api/users/profile', null, token);
        console.log('Profile:', profileRes.body.email);

        if (profileRes.status === 200) console.log('✅ Get Profile Success');
        else console.error('❌ Get Profile Failed', profileRes.status);

        console.log('\n--- 3. Update Profile ---');
        const updateData = JSON.stringify({ fullName: 'Updated Name', phone: '555-0199' });
        const updateRes = await request('PUT', '/api/users/profile', updateData, token);
        console.log('Updated Name:', updateRes.body.fullName);

        if (updateRes.body.fullName === 'Updated Name') console.log('✅ Update Profile Success');
        else console.error('❌ Update Profile Failed');

    } catch (err) {
        console.error('Verification Error:', err);
    }
}

verify();
