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
        console.log('--- Registrando Usuario (Español) ---');
        const ts = Date.now();
        const registerData = JSON.stringify({
            email: `test_${ts}@ejemplo.com`,
            password: 'password123',
            nombreCompleto: 'Usuario de Prueba',
            rol: 'PACIENTE'
        });

        const regRes = await postRequest('/api/auth/register', registerData);
        console.log('Estado Registro:', regRes.status);
        console.log('Cuerpo Registro:', regRes.body);

        if (regRes.status !== 201) {
            console.error('¡Registro fallido!');
            return;
        }

        console.log('\n--- Iniciando Sesión (Español) ---');
        const loginData = JSON.stringify({
            email: `test_${ts}@ejemplo.com`,
            password: 'password123'
        });

        const loginRes = await postRequest('/api/auth/login', loginData);
        console.log('Estado Login:', loginRes.status);
        console.log('Token presente:', !!loginRes.body.token);
        console.log('Rol del usuario:', loginRes.body.user?.rol);

        if (loginRes.status === 200 && loginRes.body.token && loginRes.body.user?.rol === 'PACIENTE') {
            console.log('✅ ¡Flujo de Autenticación en Español Verificado!');
        } else {
            console.error('❌ Login Fallido o datos incorrectos');
        }

    } catch (err) {
        console.error('Error de Verificación:', err);
    }
}

verify();
