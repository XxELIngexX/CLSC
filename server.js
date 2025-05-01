// server.js
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
app.get("/loginMicrosoft", loginMicrosoft);  // Redirigir a Microsoft

// Ruta para manejar el callback de autenticación
app.get("/auth/callback", authCallback); 
app.get("/autenticado", (req, res) => {
    res.sendFile(path.join(__dirname, "welcome.html"));  // Redirige a la página de bienvenida
});

// Iniciar el servidor
const port = process.env.PORT || 8080;  // Utiliza el puerto asignado por Azure si está disponible
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
