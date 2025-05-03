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

// Función para manejar el callback y obtener el token de acceso
async function authCallback(req, res) {
    const code = req.query.code;
    const resp = await cca.acquireTokenByCode({ /*…*/ });
    // guarda en sesión
    req.session.user = resp.account.username;
    return res.redirect('/autenticado');
}
module.exports = { loginMicrosoft, authCallback };
