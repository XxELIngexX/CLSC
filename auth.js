// auth.js
const { PublicClientApplication } = require('@azure/msal-node');
const msalConfig = {
    auth: {
        clientId: '78f83c7b-94ca-4e47-a602-8de477aa0179',  // Reemplaza con tu Client ID
        authority: 'https://login.microsoftonline.com/50640584-2a40-4216-a84b-9b3ee0f3f6cf',  // Reemplaza con tu Tenant ID
    }
};
const cca = new PublicClientApplication(msalConfig);

// Función para redirigir al inicio de sesión de Microsoft
function loginMicrosoft(req, res) {
    const authUrl = cca.getAuthCodeUrl({
        scopes: ['User.Read'],
        redirectUri: 'http://localhost:3000/auth/callback',
    });
    res.redirect(authUrl);  // Redirige a la página de login
}

// Función para manejar el callback y obtener el token de acceso
async function authCallback(req, res) {
    const authCode = req.query.code;
    const tokenRequest = {
        code: authCode,
        scopes: ['User.Read'],
        redirectUri: 'http://localhost:3000/auth/callback',
    };

    try {
        const response = await cca.acquireTokenByCode(tokenRequest);
        console.log('Token recibido:', response.accessToken);
        res.send('Inicio de sesión exitoso');
    } catch (error) {
        console.error('Error al obtener el token:', error);
        res.status(500).send('Error en la autenticación');
    }
}

// Exportar las funciones
module.exports = { loginMicrosoft, authCallback };
