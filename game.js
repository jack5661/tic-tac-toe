function playerFactory(name, mark) {
    let score = 0;
    const incrScore = () => score++;
    const getScore = () => score;
    const resetScore = () => score = 0;
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark, incrScore, getScore, resetScore};
}

const game = ( () => {
    //Representation of Board
    let board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ]; 

    //Board element on html
    const boardDOM = document.querySelector("#board"); 

    //The 3x3 Squares as an Array
    const squares = boardDOM.querySelectorAll("div");

    //Array holding html elements about turn and scores
    //[0] = turn, [1] = Player 1, [2] = Player 2
    const listing = document.querySelector("#scoreboard").querySelectorAll("h3");

    //Scoreboard
    const scoreboard = document.querySelector("#scoreboard");
    //Players
    let player1, player2; 

    let turn = true; //Keeps track of whoose turn is it to go
                    //True == Player 1's Turn, Else Player 2's Turn

    //Checks if the game has been won yet
    let gameWon = false;

    //If game is Singleplayer
    let isAI = false;

    const addPlayers = (p1, p2) => {
        if (p2 == undefined) {
            player1 = p1;
            player2 = playerFactory("AI", "O");
            isAI = true;
        } else {
            [player1, player2] = [p1, p2];
        }
        _startGame();
        boardDOM.querySelectorAll("div").forEach((square) => {
            square.onclick = () => _playerMove(square.id.charAt(3));
        });
        document.querySelector("#reset").onclick = _resetGame;
        _resetGame();
    };

    const _checkWin = () => {
        if (board[0]) {
            if (board[0] == board[1] && board[0] == board[2]) {
                _colorInSquares(0, 1, 2, "aquamarine");
                _updateScoreBoard(board[0]);
                gameWon = true;
            } else if (board[0] == board[3] && board[6] == board[0]) {
                _colorInSquares(0, 3, 6, "aquamarine");
                _updateScoreBoard(board[0]);
                gameWon = true;
            } else if (board[0] == board[4] && board[0] == board[8]) {
                _colorInSquares(0, 4, 8, "aquamarine");
                gameWon = true;
                _updateScoreBoard(board[0]);
            }
        } 
        if (board[8]) {
            if (board[8] == board[7] && board[8] == board[6]) {
                _colorInSquares(8, 7, 6, "aquamarine");
                gameWon = true;
                _updateScoreBoard(board[8]);
            } else if (board[8] == board[5] && board[8] == board[2]) {
                _colorInSquares(8, 5, 2, "aquamarine");
                gameWon = true;
                _updateScoreBoard(board[8]);
            }
        }
        if (board[4]) {
            if (board[4] == board[1] && board[4] == board[7]) {
                _colorInSquares(4, 1, 7, "aquamarine");
                gameWon = true;
                _updateScoreBoard(board[4]);
            } else if (board[4] == board[3] && board[4] == board[5]) {
                _colorInSquares(4, 3, 5, "aquamarine");
                gameWon = true;
                _updateScoreBoard(board[4]);
            } else if (board[4] == board[2] && board[4] == board[6]) {
                _colorInSquares(4, 2, 6, "aquamarine");
                gameWon = true;
                _updateScoreBoard(board[4]);
            }
        }

        if (!gameWon) {
            let check = board.reduce((acc, curr) => {
                if (curr == 0) acc = true;
                return acc;
            }, false);

            if (!check) {
                gameWon = true;
                squares.forEach((square) => square.style.backgroundColor = "#DC143C");
            }
        }
    };

    const _colorInSquares = (first, second, third, color) => {
        squares[first].style.backgroundColor = color;
        squares[second].style.backgroundColor = color;
        squares[third].style.backgroundColor = color;
    };

    const _updateScoreBoard = (winner) => {
        if (winner == 1) {
            player1.incrScore();
            let end = listing[1].textContent.length - 1;
            listing[1].textContent = listing[1].textContent.slice(0, end) + player1.getScore();
            turn = false;
        } else {
            player2.incrScore();
            let end = listing[2].textContent.length - 1;
            listing[2].textContent = listing[2].textContent.slice(0, end) + player2.getScore();
            turn = true;
        }
    }

    const _resetGame = () => {
        board = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ];
        squares.forEach((square) => {
            square.textContent = "";
            square.style.backgroundColor = "white";
        });
        gameWon = false;
        if (turn || isAI) {
            listing[0].textContent = player1.getName() + "'s Turn";
        } else {
            listing[0].textContent = player2.getName() + "'s Turn";
        }
    }

    const _startGame = () => {
        _resetGame();
        listing[1].textContent = player1.getName() + "'s Score: 0";
        listing[2].textContent = player2.getName() + "'s Score: 0";
        scoreboard.style.display = "block";
    };

    
    const _playerMove = (index) => {
        if (!gameWon) {
            index = parseInt(index);
            if (board[index] != 0) return;
    
            if (turn || isAI) {
                board[index] = 1;
                document.querySelector("#box" + index).textContent = "X";
                _checkWin();

                if (isAI && !gameWon) {
                    listing[0].textContent = player2.getName() + "'s Turn";
                    setTimeout(() => console.log("Done wait"), 750);
                    do {
                        index = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
                        if (board.reduce((acc, curr) => {
                            if (curr == 0) acc = false;
                            return acc;
                        }, true)) 
                            break;
                    } while (board[index] != 0);
                    board[index] = 2;
                    document.querySelector("#box" + index).textContent = "O";
                    listing[0].textContent = player1.getName() + "'s Turn";
                    _checkWin();
                    return;
                }
            } else {
                board[index] = 2;
                document.querySelector("#box" + index).textContent = "O";
                _checkWin();
            }
    
            if (!gameWon) {
                turn = !turn;
                if (turn) {
                    listing[0].textContent = player1.getName() + "'s Turn";
                } else {
                    listing[0].textContent = player2.getName() + "'s Turn";
                }
            }
        }
    }



    return {addPlayers,}
})();

const modal = document.querySelector("#modal");
const modal2 = document.querySelector("#modal2");

document.querySelector("#multiplayer").onclick = () => {
    modal.style.display = "block";
};

document.querySelector("#singleplayer").onclick = () => {
    modal2.style.display = "block";
}

document.querySelector("#cancel2").onclick = () => {
    document.nameForm.reset();
    modal2.style.display = "none";
}

document.querySelector("#cancel").onclick = () => {
    document.nameForm.reset();
    modal.style.display = "none";
}

document.nameForm.onsubmit = () => {
    let names = {};
    let temp = document.nameForm.querySelectorAll("input[type = text]");
    const player1 = playerFactory(temp[0].value, "X");
    const player2 = playerFactory(temp[1].value, "O");
    game.addPlayers(player1, player2);
    document.nameForm.reset();
    modal.style.display = "none";
    return false;
}

document.nameForm2.onsubmit = () => {
    let name = document.querySelector("#player0").value;
    const player1 = playerFactory(name, "X");
    game.addPlayers(player1, undefined);
    document.nameForm2.reset();
    modal2.style.display = "none";
    return false;
}