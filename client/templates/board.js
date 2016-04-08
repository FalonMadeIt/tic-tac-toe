// turn constants.
var TURN_USER = 0;
var TURN_COMPUTER = 1;

// square owner property definitions.
var Owners = { NONE: 0, USER: 1, COMPUTER: 2 };

var gameOver = false;
var whoWon = Owners.NONE;
var turn = TURN_USER;
var squarePrefixes = ['a', 'b', 'c'];

var squares = [];

var winningSquares = [];

var userWin = false;
var computerWin = false;
var noWinner = true;


//Set custom images for X and O

var newUserImage = function() {
    var xImage = document.createElement('img');
    xImage.src = 'images/x.svg';

    return xImage;
};

var newComputerImage = function() {
    var oImage = document.createElement('img');
    oImage.src = 'images/o.png';

    return oImage;
};

// the class represents a square.
var Square = function(id) {
    this.id = id;
    this.filled = false;
    this.owner = Owners.NONE;

    this.initialize = function() {
        this.box = document.getElementById(this.id); // reference the box with `id`.
        this.registerListener();
    };

    this.registerListener = function() {
        this.box.addEventListener('click', function() {
            this.move();
        }.bind(this));
    }
    this.move = function() {

        if (!gameOver) {

            if (turn === TURN_USER && !this.filled) {

                this.owner = Owners.USER;
                this.box.appendChild(newUserImage());
                this.filled = true;
                toggleTurns();
            } else if (turn === TURN_COMPUTER && !this.filled) {

                this.owner = Owners.COMPUTER;
                this.box.appendChild(newComputerImage());
                this.filled = true;
                toggleTurns();
            }

            checkWinning();

            // computer is allowed to play only if it's his turn and the game isn't over.
            if (turn === TURN_COMPUTER && !gameOver) {
                // ask the computer to move.
                computerPlays();
            }
        }

    }
};

var toggleTurns = function() {
    if (turn === TURN_USER) {
        turn = TURN_COMPUTER; // switch to computer mode.
    } else {
        turn = TURN_USER; // switch to user mode.
    }
};



// let the computer take its turn.
function computerPlays() {
    // computer filters out squares that are not filled.
    var emptySquares = squares.filter(function (box) {
        return !box.filled; // return only empty squares.
    });

    if (emptySquares.length !== 0) {
        //TODO  make chosenSquare choose form winning squares
        var randomNumber = Math.floor(Math.random() * emptySquares.length);
        var chosenSquare = emptySquares[randomNumber];

        if (chosenSquare) {
            chosenSquare.move(); // make the computer move this square.
        }
    }
}

function getFilledSquares() {
    var filledSquares = squares.filter(function(box) {
        return box.filled; // return only filled squares.
    });

    return filledSquares;
}

function checkWinning() {
    // get filled squares.
    var filledSquares = getFilledSquares();

    var result = winningSquares.find(function(combination) {

        return combination.every(function(square) {

            return filledSquares.find(function(filled) {
                return filled === square;
            });
        });
    });

    if (result) { // the game is over if someone wins.

        if (turn === TURN_USER) { // if this is true, the computer was the last to play.

            var belongsToComputer = result.every(function (square) {
                return square.owner === Owners.COMPUTER;
            });

            console.log('Belongs to computer: ' + belongsToComputer);

            if (belongsToComputer) {
                noWinner = false;
                gameOver = true;
                whoWon = Owners.COMPUTER;
                computerWin = true;
                var shauKahn = new buzz.sound('/sounds/never.mp3');
                shauKahn.play();
                alert('You will never win!');
            }
        } else if (turn === TURN_COMPUTER) { // the user was the last to play.

            var belongsToUser = result.every(function (square) {
                return square.owner === Owners.USER;
            });

            console.log('Belongs to user: ' + belongsToUser);

            if (belongsToUser) {
                noWinner = false;
                gameOver = true;
                whoWon = Owners.USER;
                userWin = true;
                var shauKahn = new buzz.sound('/sounds/well-done.mp3');
                shauKahn.play();
                alert('You have won!! All hail ...');
            }

        }

    }

    console.log(result);
}

// creates the combinations by which we compare filled boxes.
function createWinningCombinations() {
    var c1 = [squares[0], squares[1], squares[2]];
    var c2 = [squares[3], squares[4], squares[5]];
    var c3 = [squares[6], squares[7], squares[8]];
    var c4 = [squares[0], squares[3], squares[6]];
    var c5 = [squares[1], squares[4], squares[7]];
    var c6 = [squares[2], squares[5], squares[8]];
    var c7 = [squares[0], squares[4], squares[8]];
    var c8 = [squares[2], squares[4], squares[6]];

    winningSquares.push(c1, c2, c3, c4, c5, c6, c7, c8);
}

Template.board.onRendered(function(){
    // get references to all squares.
    for (var i = 0; i < 3; i++) {
        var prefix = squarePrefixes[i];

        for (j = 0; j < 3; j++) {
            // access the next square: a1,a2,a3 - c1,c2,c3.
            var squareId = prefix + (j+1);

            // create a new square.
            var square = new Square(squareId);
            squares.push(square);

            square.initialize();
        }
    }
    createWinningCombinations();
});
