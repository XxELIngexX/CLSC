// auth.js
const { PublicClientApplication } = require('@azure/msal-node');
const msalConfig = {
    auth: {
        clientId: '78f83c7b-94ca-4e47-a602-8de477aa0179',  // App ID
        authority: 'https://login.microsoftonline.com/50640584-2a40-4216-a84b-9b3ee0f3f6cf',  // Tenant ID
    }
};
const cca = new PublicClientApplication(msalConfig);

// Función para redirigir al inicio de sesión de Microsoft
function loginMicrosoft(req, res) {
    cca.getAuthCodeUrl({
        scopes: ['User.Read'],
        redirectUri: 'https://clsg-app.azurewebsites.net/auth/callback',
    })
    .then(authUrl => {
        console.log("🔹 URL de autenticación:", authUrl);  // Verifica la URL en la consola
        res.redirect(authUrl);  // Redirige a la página de login
    })
    .catch(error => {
        console.error("Error al obtener la URL de autenticación:", error);
        res.status(500).send('Error en el inicio de sesión');
    });
}

// Función para manejar el callback y obtener el token de acceso
async function authCallback(req, res) {
    const authCode = req.query.code;

    if (!authCode) {
        console.error('No se recibió código de autorización');
        return res.status(400).send('No se recibió código de autorización');
    }

    const tokenRequest = {
        code: authCode,
        scopes: ['User.Read'],
        redirectUri: 'https://clsg-app.azurewebsites.net/auth/callback',
    };

    try {
        const response = await cca.acquireTokenByCode(tokenRequest);
        console.log('Token recibido:', response.accessToken);
        
        // Redirigir a la página de bienvenida después de una autenticación exitosa
        res.redirect('/autenticado');  // Redirige a la página de bienvenida
    } catch (error) {
        console.error('Error al obtener el token:', error);
        res.status(500).send('Error en la autenticación');
    }
}
module.exports = { loginMicrosoft, authCallback };
