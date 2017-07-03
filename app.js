const express = require('express');
const session = require('express-session')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();
const fs    = require("fs")
// const data = require("./data");

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");


app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));

//I don't know what these things do:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.get('/', function (req, res) {
	getRndInteger(req, res)
  res.render('index', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay, wrong: req.session.guessesremaining, solvedmessage: req.session.solvedmessage});
});

app.post('/playagain', function (req, res) {
	getRndInteger(req, res)
  res.render('index', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay, wrong: req.session.guessesremaining, solvedmessage: req.session.solvedmessage});
});

function getRndInteger(req, res) {
	req.session.singleword = words[Math.floor(Math.random() * (words.length + 1) )];
	req.session.wordarr = [];
	for (var i = 0; i < req.session.singleword.length; i++) {
		req.session.wordarr.push(req.session.singleword.charAt(i))
	}
	req.session.blanksarr = []
	for (var i = 0; i < req.session.wordarr.length; i++) {
		req.session.blanksarr.push("_")
	}
	req.session.blanksdisplay = req.session.blanksarr.join(" ");
	req.session.guesses = []
	req.session.guessdisplay = ""
	req.session.guessesremaining = 10
	req.session.wrongguesses = 0
	req.session.solvedmessage = "<form action='/' method='post'><input type='text' name='inputguess' value='' maxlength='1' autofocus><br><input type='submit' name='Enter' value='Enter'>"
};

app.post ('/', function (req, res) {
	solved = false;
	req.session.inputguess = req.body.inputguess
	var correctguess = false
	for (var i = 0; i < req.session.singleword.length; i++) {
		if (req.session.inputguess === req.session.singleword.charAt(i)) {
			req.session.blanksarr[i] = req.session.inputguess
			req.session.blanksdisplay = req.session.blanksarr.join(" ");
			correctguess = true
		}
	}
	if (correctguess === false) {
		req.session.guesses.push(req.session.inputguess.charAt(0));
		req.session.guessdisplay = req.session.guesses.join (" ");
		req.session.wrongguesses ++
	}
	req.session.guessesremaining = 10 - req.session.wrongguesses
	if (req.session.guessesremaining <= 0) {
		req.session.solvedmessage = "YOU LOSE! The word was " + req.session.singleword + "." +
		`<form action='/playagain' method='post'>
		<input type='submit' name= "/" value="Play Again?">
		<form>`
	}
	req.session.solved = true
	for (var i = 0; i < req.session.blanksarr.length; i++) {
		if (req.session.blanksarr[i] === "_") {
			req.session.solved = false
		}
	}
	if (req.session.solved === true) {
		req.session.solvedmessage = "YOU SOLVED IT!" +
		`<form action='/playagain' method='post'>
		<input type='submit' name= "/" value="Play Again?">
		<form>`
	}
	res.render('index', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay,  wrong: req.session.guessdisplay, solvedmessage: req.session.solvedmessage, wrong: req.session.guessesremaining});
})

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
