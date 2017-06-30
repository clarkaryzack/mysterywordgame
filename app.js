const express = require('express');
const session = require('express-session')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();
const fs    = require("fs")
const data = require("./data");

const words = data.words
const arr = []
const guesses = []
const solvedmessage = "YOU SOLVED IT!"

var wrongguess = 0
var correct = false

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));

//I don't know what these things do:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var singleword;

function getRndInteger(min, max) {
		singleword = words[Math.floor(Math.random() * (max - min + 1) ) + min];
		console.log(singleword)
};

getRndInteger(0, words.length)

console.log(singleword)


for(i=0 ; i < singleword.word.length ; i++) {
	arr.push(singleword.word.charAt(i))
}

console.log(arr.length)
console.log(arr)

for (i=0 ; i < arr.length ; i++) {
	guesses.push("_")
}

console.log(guesses)

guessdisplay = guesses.join(" ")

app.get('/', function (req, res) {
  res.render('index', {singleword: singleword, array: arr, guesses: guessdisplay, wrong: wrongguess});
});

app.post('/', function (req, res) {
	solved = false
	let inputguess = req.body.inputguess
	console.log(inputguess)
	correct = false
	for (let i=0 ; i < arr.length ; i++) {
		if (inputguess === arr[i]) {
			guesses[i] = arr[i];
			correct = true
			solved = true
			for (let i=0 ; i < guesses.length ; i++) {
				if (guesses[i] === "_") solved = false
			}
		}
		guessdisplay = guesses.join(" ")
	}
	if (solved === true) {
		res.render('index', {singleword: singleword, array: arr, guesses: guessdisplay, wrong: wrongguess, solvedmessage: solvedmessage});
	}
	if (correct === false) wrongguess ++
	if (solved ===false) {
		res.render('index', {singleword: singleword, array: arr, guesses: guessdisplay, wrong: wrongguess});
	}
});

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
