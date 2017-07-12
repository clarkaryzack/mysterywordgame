
const session = require('express-session');
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');

const router = express.Router();
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

let winners;
const savefile = 'winners.json';
jsonfile.readFile(savefile, function(err,obj){
	winners = obj;
})

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/easy', function (req, res) {
	req.session.difficulty = 0
	res.redirect('/game')
});

router.get('/medium', function (req, res) {
	req.session.difficulty = 1
	res.redirect('/game')
});

router.get('/hard', function (req, res) {
	req.session.difficulty = 2
	res.redirect('/game')
});

router.get('/game', function (req, res) {
	let getRandomWord = logic.getRandomWord(req, res);
  res.render('game', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay, solvedmessage: req.session.solvedmessage, hangmanimage: req.session.hangmanimage});
});

router.post ('/game', function (req, res) {
	let checkGuess = logic.checkGuess(req, res);
	res.render('game', {singleword: req.session.singleword, array: req.session.wordarr, blanks: req.session.blanksdisplay, guesses: req.session.guessdisplay,  wrong: req.session.guessdisplay, solvedmessage: req.session.solvedmessage, hangmanimage: req.session.hangmanimage});
});

router.post ('/playagain', function (req, res) {
	res.redirect('/')
});

router.post ('/winnerform', function (req, res) {
	res.render('winnerform');
});

router.post ('/winnerlist', function (req, res) {
	// let recordWinner = logic.recordWinner(req, res);
	let name = req.body.winnername;
	console.log(winners);
	let id = winners.winners.length + 1;
	winners.winners.push({"id": id, "name": name, "word": req.session.singleword, "difficulty": req.session.difflevel});
	jsonfile.writeFileSync(savefile, winners);
	res.render('winnerlist', {winners: winners.winners}
	);
});

module.exports = router;
