const express = require('express');
const app = express();
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
require("./passport")

app.use(cors());
app.use(bodyParser.json());
app.use(cookieSession(
  {
    name: "gabriel-dev",
    keys: ["key1", "key2"]
  }  
));

const isLoggedIn = (req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
} 

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send("Você precisa se autenticar");
});

app.get('/user', isLoggedIn, (req, res) => {
  res.status(200).send(`Olá ${req.user.displayName}, email: ${req.user.emails[0].value}`);
});

app.get('/fail', function (req, res) {
  res.status(400).send("Você não conseguiu se conectar!");
});

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/fail' }),
  function(req, res) {
    res.redirect('/user');
});

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
})
 
app.listen(3000, () => console.log("Rodando na porta 3000"));