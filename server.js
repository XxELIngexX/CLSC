const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = 8080;

// Middleware para procesar datos JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (index.html, user.html, imágenes, etc.)
app.use(express.static(__dirname));


// 🔹 Ruta para servir la página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 🔹 Ruta para servir user.html
app.get("/user", (req, res) => {
    res.sendFile(path.join(__dirname, "user.html"));
});

// 🔹 Ruta para manejar el login
app.post("/login", (req, res) => {
    console.log(req.body); // Mostrar los datos recibidos en la consola
    const { username, password } = req.body;
    res.json({
        message: "Solicitud recibida",
        usuario: username,
        contraseña: password
    });
});

// 🔹 Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
