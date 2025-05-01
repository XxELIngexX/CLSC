// server.js

console.log('CLIENT_SECRET desde env:', process.env.CLIENT_SECRET);


const express = require('express');
const session = require('express-session');       // <— require
const path    = require('path');
const { loginMicrosoft, authCallback } = require('./auth');

const app = express();

// 1) CONFIGURA express-session ANTES de cualquier ruta
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_muy_secreta', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // si en producción usas HTTPS, pon secure:true
}));

// 2) Middleware estáticos y de parsing (si lo necesitas)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 3) Tus rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/login', loginMicrosoft);
app.get('/auth/callback', authCallback);
app.get("/autenticado", (req, res) => {
  if (!req.session.user) {
    // Sin sesión → redirige a /login
    return res.redirect('/login');
  }
    // Tienes user → sirves la página de bienvenida
  
    // Responder con página HTML que muestra el token
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>Bienvenido</title></head>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#6c2bd9;color:#fff;">
        <h1>¡Bienvenido, ${req.session.user}!</h1>
      </body>
      </html>
    `);
  });


// Iniciar el servidor
const port = process.env.PORT || 8080;  // Utiliza el puerto asignado por Azure si está disponible
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
