const express = require('express');
const session = require('express-session')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();
const fs    = require("fs")
const data = require("./data");

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const datawords = data.words


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
  res.render('index', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay, solvedmessage: req.session.solvedmessage, hangmanimage: req.session.hangmanimage});
});

app.post('/playagain', function (req, res) {
	getRndInteger(req, res)
  res.render('index', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay, solvedmessage: req.session.solvedmessage, hangmanimage: req.session.hangmanimage});
});

function getRndInteger(req, res) {
	// req.session.singleword = words[Math.floor(Math.random() * (words.length + 1) )];
	req.session.singleword = datawords[Math.floor(Math.random() * (datawords.length + 1) )].word;
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
	req.session.guessesremaining = 7
	req.session.hangmanimage = "/images/Hangman-0.png"
	req.session.solvedmessage = "<form action='/' method='post'><input type='text' name='inputguess' value='' maxlength='1' autocomplete='off' autofocus><br><input type='submit' name='Enter' value='Enter'>"
};

app.post ('/', function (req, res) {
	req.body.inputguess = req.body.inputguess.toLowerCase()
	console.log(req.body.inputguess)
	solved = false;
	var correctguess = false;
	for (var i = 0; i < req.session.singleword.length; i++) {
		if (req.body.inputguess === req.session.singleword.charAt(i)) {
			req.session.blanksarr[i] = req.body.inputguess
			req.session.blanksdisplay = req.session.blanksarr.join(" ");
			correctguess = true
		}
	};
	if (correctguess === false) {
		var alreadyguessed = false
		for (var i = 0; i < req.session.guesses.length; i++) {
			if (req.session.guesses[i] === req.body.inputguess) {
				alreadyguessed = true
			}
		}
		if (req.body.inputguess === "") alreadyguessed = true
		if (alreadyguessed === false) {
			req.session.guesses.push(req.body.inputguess);
			req.session.guessdisplay = req.session.guesses.join (" ");
			req.session.guessesremaining = req.session.guessesremaining - 1;
		}
	}
	if (req.session.guessesremaining === 6) {
		req.session.hangmanimage = "/images/Hangman-1.png"
	}
	if (req.session.guessesremaining === 5) {
		req.session.hangmanimage = "/images/Hangman-2.png"
	}
	if (req.session.guessesremaining === 4) {
		req.session.hangmanimage = "/images/Hangman-3.png"
	}
	if (req.session.guessesremaining === 3) {
		req.session.hangmanimage = "/images/Hangman-3.png"
	}
	if (req.session.guessesremaining === 2) {
		req.session.hangmanimage = "/images/Hangman-4.png"
	}
	if (req.session.guessesremaining === 1) {
		req.session.hangmanimage = "/images/Hangman-5.png"
	}
	if (req.session.guessesremaining === 0) {
		req.session.hangmanimage = "/images/Hangman-6.png"
	}
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
	res.render('index', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay,  wrong: req.session.guessdisplay, solvedmessage: req.session.solvedmessage, hangmanimage: req.session.hangmanimage});
})

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
