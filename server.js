const express = require('express');
const session = require('express-session'); // Asegúrate de haber instalado este paquete
const path = require('path');
const { loginMicrosoft, authCallback } = require('./auth'); // Importa las funciones

const app = express();

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'miClaveSecreta',  // Cambia esto por algo más seguro
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Si usas HTTPS, cambia a `true`
}));

app.use(express.static(__dirname));

// Ruta para la página principal
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Ruta para iniciar sesión con Microsoft
app.get('/login', loginMicrosoft);

// Ruta para manejar el callback de autenticación
app.get('/auth/callback', authCallback);

// Ruta para el acceso a la página de bienvenida
app.get('/welcome.html', (req, res) => {
  const user = req.session.user;

  // Verifica si el usuario está autenticado
  if (!user) {
    return res.redirect('/login'); // Si no está autenticado, redirige al login
  }

  // Si está autenticado, permite el acceso a la página welcome.html
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

// Ruta para redirigir a /autenticado
app.get('/autenticado', (req, res) => {
  const user = req.session.user;

  // Verifica si el usuario está autenticado
  if (!user) {
    return res.redirect('/login'); // Si no está autenticado, redirige al login
  }

  // Si está autenticado, redirige a welcome.html con el parámetro de usuario
  res.redirect(`/welcome.html?user=${user}`);
});



// Inicia el servidor
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
