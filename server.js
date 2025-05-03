// server.js

console.log('CLIENT_SECRET desde env:', process.env.CLIENT_SECRET);


const express = require('express');
const path    = require('path');
const { loginMicrosoft, authCallback } = require('./auth');
const app = express();

app.use(express.static(__dirname));

app.get('/',      (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', loginMicrosoft);
app.get('/auth/callback', authCallback);
app.get('/autenticado', (req, res) => {
  // Verifica si el usuario está en la sesión
  if (!req.session.user) {
    // Si no está autenticado, redirige al login
    return res.redirect('/login');
  }
  // Si está autenticado, muestra la página de bienvenida
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.listen(process.env.PORT||8080, ()=> console.log('Listening'));
