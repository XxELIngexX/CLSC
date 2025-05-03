// server.js

console.log('CLIENT_SECRET desde env:', process.env.CLIENT_SECRET);


const express = require('express');
const session = require('express-session');
const path    = require('path');
const { loginMicrosoft, authCallback } = require('./auth');

const app = express();

// 1) SESSIONS — debe ir antes de app.use(express.static) y de las rutas
// Configuración correcta de express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'una_clave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Si en producción usa HTTPS, pon secure: true
}));


// 2) Archivos estáticos y parsing (si los necesitas)
app.use(express.static(__dirname));

// 3) Rutas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', loginMicrosoft);
app.get('/auth/callback', authCallback);
app.get('/autenticado', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.listen(process.env.PORT || 8080, () => 
  console.log('Servidor corriendo')); 