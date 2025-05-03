// auth.js
const REDIRECT_URI = "https://clsg-app.azurewebsites.net/auth/callback";


const { PublicClientApplication } = require('@azure/msal-node');
const msalConfig = {
    auth: {
        clientId: '78f83c7b-94ca-4e47-a602-8de477aa0179',  // App ID
        authority: 'https://login.microsoftonline.com/50640584-2a40-4216-a84b-9b3ee0f3f6cf',  // Tenant ID
    }
};
const cca = new PublicClientApplication(msalConfig);
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
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("No se recibió el código de autorización.");
    }

    try {
        const resp = await cca.acquireTokenByCode({
            code,
            scopes: ['User.Read'],
            redirectUri: REDIRECT_URI,
        });
        console.log('Token recibido:', resp);  // Añadir un log para depurar

        if (resp.account && resp.account.username) {
            req.session.user = resp.account.username;  // Guardar el usuario en la sesión
        } else {
            console.error('No se pudo obtener el usuario.');
            return res.status(500).send('Error: No se pudo obtener el nombre de usuario.');
        }

        return res.redirect('/autenticado');
    } catch (error) {
        console.error('Error al obtener el token:', error);
        res.status(500).send('Error en la autenticación');
    }
}

module.exports = { loginMicrosoft, authCallback };
