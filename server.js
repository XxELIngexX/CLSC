// server.js

console.log('CLIENT_SECRET desde env:', process.env.CLIENT_SECRET);


const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { loginMicrosoft, authCallback } = require('./auth');  // Importa las funciones

const app = express();

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
    const user = req.query.user;
    if (!user) {
      // sin user en la URL → vuelves a /login
      return res.redirect('/login');
    }
    // Tienes user → sirves la página de bienvenida
  
    // Responder con página HTML que muestra el token
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>¡Bienvenido!</h1>
        <p>Este es el token capturado (pass-the-token):</p>
       
      </body>
      </html>
    `);
  });


// Iniciar el servidor
const port = process.env.PORT || 8080;  // Utiliza el puerto asignado por Azure si está disponible
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
