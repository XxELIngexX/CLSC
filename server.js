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
  const user = req.query.user;
  if (!user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.listen(process.env.PORT||8080, ()=> console.log('Listening'));
