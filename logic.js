const session = require('express-session');
const logic = require('./logic.js');
const fs = require("fs")

const dataeasy = require("./data_easy");
const datamedium = require("./data_medium");
const jsonfile = require('jsonfile');

const hardwords = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const easywords = dataeasy.words
const mediumwords = datamedium.words



const getRandomWord = function (req, res) {
	console.log(req.session.difficulty);
	if (req.session.difficulty === 0){
		req.session.singleword=easywords[Math.floor(Math.random() * (easywords.length + 1) )];
		req.session.difflevel = "easy";
	}
	if (req.session.difficulty === 1){
		req.session.singleword=mediumwords[Math.floor(Math.random() * (mediumwords.length + 1) )];
		req.session.difflevel = "medium";
	}
	if (req.session.difficulty === 2){
		req.session.singleword=hardwords[Math.floor(Math.random() * (hardwords.length + 1) )];
		req.session.difflevel = "hard";
	}

	req.session.wordarr = [];
	console.log(req.session.singleword)
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
	req.session.solvedmessage = "<form action='/game' method='post'><input type='text' id='letterguess' name='inputguess' value='' maxlength='1' autocomplete='off' autofocus><br><input type='submit' name='Enter' value='Enter'>";
	return getRandomWord
	next();
};

const checkGuess = function (req, res) {
	req.body.inputguess = req.body.inputguess.toLowerCase()
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
		`<form action='/winnerform' method='post'>
		<input type='submit' name= "/" value="Record Your Score?">
		<form><br>
		<form action='/playagain' method='post'>
		<input type='submit' name= "/" value="Play Again?">
		<form>`
	}

	return checkGuess;
	next();
};







module.exports = {
	getRandomWord : getRandomWord,
	checkGuess : checkGuess,
}
