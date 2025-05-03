// server.js

console.log('CLIENT_SECRET desde env:', process.env.CLIENT_SECRET);


const express = require('express');
const session = require('express-session');  // Asegúrate de importar express-session
const path = require('path');
const { loginMicrosoft, authCallback } = require('./auth'); // Importar las funciones

const app = express();

// 1. Configura express-session ANTES de cualquier ruta
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_muy_secreta',  // Cambia esta clave por algo seguro
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // Cambia a true si usas HTTPS en producción
  }
}));

// 2. Archivos estáticos
app.use(express.static(__dirname));

// 3. Rutas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', loginMicrosoft);
app.get('/auth/callback', authCallback);

app.get('/autenticado', (req, res) => {
  // 4. Verifica que req.session.user existe
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige si no está autenticado
  }
  // 5. Sirve el welcome.html
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
