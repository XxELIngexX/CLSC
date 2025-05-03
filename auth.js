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

async function authCallback(req, res) {
  const code = req.query.code;  // El código de autorización
  try {
    const response = await cca.acquireTokenByCode({
      code: code,
      scopes: ['User.Read'],
      redirectUri: 'https://clsg-app.azurewebsites.net/auth/callback',  // Redirige aquí
    });
    console.log('Token recibido:', response);

    // Asegúrate de guardar el usuario en la sesión
    req.session.user = response.account.username;  // Aquí guardas el nombre de usuario
    return res.redirect('/autenticado');
  } catch (error) {
    console.error('Error al obtener el token:', error);
    res.status(500).send('Error en la autenticación');
  }
}

module.exports = { loginMicrosoft, authCallback };
