// auth.js
const REDIRECT_URI = "https://clsg-app.azurewebsites.net/auth/callback";


const { ConfidentialClientApplication } = require('@azure/msal-node');
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: process.env.AUTHORITY, 
        clientSecret: process.env.CLIENT_SECRET
                }
};
const cca = new ConfidentialClientApplication(msalConfig);


// Función para redirigir al inicio de sesión de Microsoft
function loginMicrosoft(req, res) {
    cca.getAuthCodeUrl({
        scopes: ['User.Read'],
        redirectUri: REDIRECT_URI,
    })
    .then(authUrl => {
        console.log("🔹 URL de autenticación:", authUrl);  // Verifica la URL en la consola
        res.redirect(authUrl);  // Redirige a la página de login
    })
    .catch(error => {
        console.error("Error al obtener la URL de autenticación: (cesar)", error);
        res.status(500).send('Error en el inicio de sesión (cesar)');
    });
}

async function authCallback(req, res) {
    const authCode = req.query.code;  // El código de autorización desde la query string
    if (!authCode) {
        console.error("Error: No se recibió el código de autorización");
        return res.status(400).send('Código de autorización no recibido');
    }

    console.log("🔹 Código de autorización recibido:", authCode);

    const tokenRequest = {
        code: authCode,
        scopes: ['User.Read'],
        redirectUri: REDIRECT_URI,  // La URL de redirección de Azure
    };

    try {
        const response = await cca.acquireTokenByCode(tokenRequest);
        console.log('Token recibido:', response.accessToken);

        // Redirige a la página de bienvenida después de un inicio de sesión exitoso
        res.redirect(`/autenticado?user=${encodeURIComponent(response.account.username)}`);  // Pasar el nombre de usuario en la URL
    } catch (error) {
        console.error('(cesar) Error al obtener el token:', error);
        res.status(500).send('(cesar) Error en la autenticación');
    }
}

module.exports = { loginMicrosoft, authCallback };