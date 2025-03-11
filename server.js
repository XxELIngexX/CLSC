const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = 3000;

// Middleware para procesar datos JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (index.html, user.html, imágenes, etc.)
app.use(express.static(__dirname));

// 🔹 Función para generar hash NTLM
function ntlmHash(password) {
    const hash = crypto.createHash("md4");
    hash.update(Buffer.from(password, "utf16le"));
    return hash.digest("hex").toUpperCase();
}

// 🔹 Base de datos simulada (almacena usuarios con hashes NTLM)
const usersDB = {
    "victima": ntlmHash("password123")  // Usuario de prueba
};

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
    const { username, password } = req.body;

    // Verificar si el usuario existe
    if (!usersDB[username]) {
        return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Comparar el hash ingresado con el almacenado
    const hashIngresado = ntlmHash(password);
    if (hashIngresado === usersDB[username]) {
        // 🔥 Redirigir a welcome.html con el usuario en la URL
        console.log("🔹 Hash generado en el servidor:", hashIngresado); // Muestra el hash en la consola

        return res.json({ success: true, redirect: `/welcome.html?user=${encodeURIComponent(username)}` });

    } else {
        return res.status(401).json({ message: "Credenciales incorrectas" });
    }
});

// 🔹 Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
