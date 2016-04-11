// turn constants.
var Turn_User = 0;
var Turn_Computer = 1;

// square owner property definitions.
var squareOwners = {None:0, User:1, Computer:2};

var gameOver = false;
var turn = Turn_User;
var whoWon = squareOwners.None;

var squares = [];
var winningSquares = [];

var userWon = false;
var computerWon = false;
var noneWon = false;


//Set custom images for X and O
var userImage = function () {
    var xImage = document.createElement('img');
    xImage.src = 'public/images/x.svg';

    return xImage;
};

var computerImage = function () {
    var oImage = document.createElement('img');
    oImage.src = 'public/images/o.png';

    return oImage;
};


var toggleTurns = function () {
    if(turn === Turn_User){
        turn = Turn_Computer;
    }else{
        turn = Turn_User;
    }
};

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

// the class represents a square.
var Square = function (id) {
    this.id = id;
    this.filled = false;
    this.owner = squareOwners.None;

    this.initialize = function () {
        this.box = document.getElementById(this.id);
        this.registerListner();
    };

    this.registerListner = function () {
        this.box.addEventListener('click', function () {
            this.move();
        }.bind(this));
    };

    this.move = function () {
        if(!gameOver){

            if(turn === Turn_User && !this.filled){
                this.owner = squareOwners.User;
                this.box.appendChild(userImage());
                this.filled = true;
                toggleTurns();
            }else if(turn === Turn_Computer && !this.filled){
                this.owner = squareOwners.Computer;
                this.box.appendChild(computerImage());
                this.filled = true;
                toggleTurns();
            }

            checkWinning();

            // computer is allowed to play only if it's his turn and the game isn't over.
            if(turn === Turn_Computer && !gameOver){
               computerPlays();
                
            }
        }
    }
};

function computerPlays() {
    var emptySquares = squares.filter(function (box) {
        return !box.filled; // return only empty squares.
    });

    if (emptySquares.length !== 0) {
        //TODO  make chosenSquare choose form winning squares
        var randomNumber = Math.floor(Math.random() * emptySquares.length);
        var chosenSquare = emptySquares[randomNumber];

        if (chosenSquare) {
            chosenSquare.move();
        }
    }
}

function getFilledSquares () {
    return squares.filter(function (box) {
        return box.filled;
    });
}


function checkWinning(){
    var filledSquares = getFilledSquares();

    var declareWin = winningSquares.find(function(combination){

        return combination.every(function(square){
            return filledSquares.find(function(filled) {
                return filled === square;
            });
        });
    });

    if(declareWin){

        if(turn === Turn_User){
            var belongsToComputer = declareWin.every(function (square){
                return square.owner === squareOwners.Computer;
            });

            console.log('Belongs to computer: ' + belongsToComputer);

            if(belongsToComputer){
                gameOver = true;
                whoWon = squareOwners.Computer;
                computerWon = true;
                var shauKahn = new buzz.sound('public/sounds/never.mp3');
                shauKahn.play();
                alert('You will never win!');

            }
        }else if(turn === Turn_Computer){
            var belongsToUser = declareWin.every(function (square) {
                return square.owner === squareOwners.User;
            });

            console.log('Belongs to user: ' + belongsToUser);

            if(belongsToUser){
                gameOver = true;
                whoWon = squareOwners.User;
                userWon = true;
                var shauKahn = new buzz.sound('public/sounds/well-done.mp3');
                shauKahn.play();
                alert('You have won!! All hail ...');
            }
        }
        else{
            var belongsToNone = declareWin.every(function(square){
               return square.owner === squareOwners.None;
            });

            console.log('Belongs to none: ' + belongsToNone);

            if(belongsToNone){
                gameOver = true;
                whoWon = Owners.None;
                noneWon = true;
                var shauKahn = new buzz.sound('/sounds/loser.mp3');
                shauKahn.play();
                alert('It\'s a Draw');
            }
        }
        console.log("DECLARE THE WINNER", declareWin);
    }
}

var squarePrefixes = ['a', 'b', 'c'];

window.onload = function () {
    //get references to all squares

    for(var i = 0; i < squarePrefixes.length; i++){
        var prefix = squarePrefixes[i];

        for(var j = 0; j < 3; j++){
            var squareId = prefix + (j+1);

            //create new square
            var square = new Square(squareId);
            squares.push(square);
            square.initialize();
        }

    }
    var shauKahn = new buzz.sound('public/sounds/laugh.mp3');
    shauKahn.play().fadeOut(2500);;
    createWinningCombinations();
};






