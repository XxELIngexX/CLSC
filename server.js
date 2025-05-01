// server.js

console.log('CLIENT_SECRET desde env:', process.env.CLIENT_SECRET);


const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const path = require("path");
const { loginMicrosoft, authCallback } = require('./auth');  // Importa las funciones

const app = express();


// ————————  CONFIGURA sessions —————————
app.use(session({
  secret: process.env.SESSION_SECRET || 'unaClaveMuySecreta', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // si usas HTTPS en producción pon secure: true
}));

// Middleware para procesar datos JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (index.html, user.html, imágenes, etc.)
app.use(express.static(__dirname));

// Ruta para la página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Ruta para iniciar sesión con Microsoft
app.get("/login", loginMicrosoft);  // Redirigir a Microsoft

// Ruta para manejar el callback de autenticación
app.get("/auth/callback", authCallback); 

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
