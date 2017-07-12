const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();
const fs = require("fs")
const dataeasy = require("./data_easy");
const datamedium = require("./data_medium");
const logic = require('./logic');
const expressValidator = require('express-validator');

// const hardwords = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const easywords = dataeasy.words
const mediumwords = datamedium.words
const routes = require('./routes');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));

//I don't know what these things do:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use(routes);

app.listen(process.env.PORT || 3000, function () {
  console.log('Successfully started express application!');
});
