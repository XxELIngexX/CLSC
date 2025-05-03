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
    const authCode = req.query.code;
    if (!authCode) return res.status(400).send('Código de autorización no recibido');
  
    console.log("🔹 Código de autorización recibido:", authCode);
  
    const tokenRequest = {
      code: authCode,
      scopes: ['User.Read'],
      redirectUri: REDIRECT_URI,
    };
  
    try {
      const response = await cca.acquireTokenByCode(tokenRequest);
      console.log('Token recibido:', response.accessToken);
  
      // Guardamos el usuario en la sesión
      req.session.user = response.account.username;
  
      // Redirige a la página de bienvenida
      res.redirect('/autenticado');
    } catch (error) {
      console.error('Error al obtener el token:', error);
      res.status(500).send('Error en la autenticación');
    }
  }
  

module.exports = { loginMicrosoft, authCallback };
