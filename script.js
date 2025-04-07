const Gameboard = (() => {
    const board = new Array(9).fill(null);

    const printBoard = () => {
        let boardStr = "";
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                boardStr += "_";
            } else {
                boardStr += board[i];
            }
            if ((i + 1) % 3 === 0) {
                boardStr += "\n";
            } else {
                boardStr += " ";
            }
        }
        console.log(boardStr);
    };

    const getBoard = () => board;

    const resetBoard = () => board.fill(null);

    const setMark = (index, mark) => {
        if (index < 0 || index > 8 || board[index] !== null) return false;
        board[index] = mark;
        return true;
    };

    const getSquare = index => board[index];

    const isFull = () => board.every(cell => cell !== null);


    return {
        printBoard,
        getBoard,
        resetBoard,
        setMark,
        getSquare,
        isFull
    };
})();


const Player = (name, mark) => {
    let score = 0;
    return {
        getScore: () => score,
        getName: () => name,
        getMark: () => mark,
        setName: newName => { name = newName; },
        setMark: newMark => { mark = newMark; },
        addScore: () => { score += 1; },
        resetScore: () => { score = 0; },
    };
};



const GameLogic = (() => {
    let gameStarted = false;


    const players = [
        Player(null, "X"),
        Player(null, "O")
    ];

    let currentPlayer = players[0];
    let lastLoser = null;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const isGameStarted = () => gameStarted;
    const startGame = () => gameStarted = true;
    const stopGame = () => gameStarted = false;

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const getOpponent = () => {
        return currentPlayer === players[0] ? players[1] : players[0];
    }

    const setCurrentPlayer = (player) => {
        currentPlayer = player;
    }

    const makeMove = (index) => Gameboard.setMark(index, currentPlayer.getMark());

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWin = (mark) => {
        const hasWon = winningCombinations.some(([a, b, c]) =>
            [a, b, c].every(i => Gameboard.getSquare(i) === mark)
        );

        if (hasWon) {
            // Store the loser to start next round
            lastLoser = getOpponent();
        }

        return hasWon;
    };

    const checkDraw = () => {
        return Gameboard.isFull();
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        // If there's a stored loser, make them start
        if (lastLoser) {
            setCurrentPlayer(lastLoser);
        } else {
            // Default to player1 if no game has been won yet
            setCurrentPlayer(players[0]);
        }
    };

    const getPlayer1 = () => players[0];
    const getPlayer2 = () => players[1];

    return {
        checkWin,
        checkDraw,
        resetGame,
        makeMove,
        getCurrentPlayer,
        switchPlayer,
        getPlayer1,
        getPlayer2,
        startGame,
        stopGame,
        isGameStarted
    };
})();


const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('.player');
    const resetButton = document.querySelector('.reset');
    const submitButton = document.querySelector('.submitBtn');
    const player1Score = document.querySelector('.player1-score');
    const player2Score = document.querySelector('.player2-score');

    const renderBoard = () => {
        Gameboard.getBoard().forEach((mark, index) => {
            cells[index].textContent = mark === null ? "" : mark;

            cells[index].classList.remove("X", "O");

            if (mark === "X" || mark === "O") {
                cells[index].classList.add(mark); // dynamically adds "X" or "O"
            }
        });


    };

    const setMessage = msg => {
        message.textContent = msg;
    }

    const updateScores = () => {
        player1Score.textContent = `${GameLogic.getPlayer1().getName()} score: ${GameLogic.getPlayer1().getScore()}`;
        player2Score.textContent = `${GameLogic.getPlayer2().getName()} score: ${GameLogic.getPlayer2().getScore()}`;
    }

    const removeCellClickEvents = () => {
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
    }

    const handleCellClick = (e) => {
        const index = parseInt(e.target.getAttribute('id'));
        const currentPlayer = GameLogic.getCurrentPlayer();

        if (!GameLogic.makeMove(index)) return; // prevent overwrite the same cell

        renderBoard();


        if (GameLogic.checkWin(currentPlayer.getMark())) {
            setMessage(`${currentPlayer.getName()} wins!`);
            e.target.style.backgroundColor = 'bisque';
            cells.forEach(cell => {
                cell.removeEventListener('mouseover', handleMouseOver);
                cell.removeEventListener('mouseout', handleMouseOut);
            });

            
            
            
            currentPlayer.addScore();
            updateScores();
            removeCellClickEvents(); // Disable further clicks
        
            return;
        }else if (GameLogic.checkDraw()) {
            setMessage("It's a draw!");
            removeCellClickEvents(); // Disable further clicks
            cells.forEach(cell => {
                if (cell.style.backgroundColor !== 'lightgreen') {
                    cell.style.backgroundColor = 'lightgrey';
                }
            });
            renderBoard();
            return;
        } else {
            GameLogic.switchPlayer();
            const nextPlayer = GameLogic.getCurrentPlayer();
            setMessage(`${nextPlayer.getName()}'s turn (${nextPlayer.getMark()})`);
            e.target.removeEventListener('mouseover', handleMouseOver);
        }
    };

    const bindEvents = () => {
        resetButton.addEventListener('click', () => {
            GameLogic.resetGame();
            cells.forEach(cell => {
                cell.addEventListener('click', handleCellClick);
                cell.style.backgroundColor = 'bisque';
            });
            renderBoard();
            setMessage(`${GameLogic.getCurrentPlayer().getName()}'s turn (${GameLogic.getCurrentPlayer().getMark()})`);
        });
    
        submitButton.addEventListener('click', () => {
            const player1Name = document.getElementById('player1-name').value.trim();
            const player2Name = document.getElementById('player2-name').value.trim();

            if (player1Name === "" || player2Name === "") {
                alert("Please enter names for both players.");
                return;
            }

            GameLogic.getPlayer1().setName(player1Name);
            GameLogic.getPlayer2().setName(player2Name);

            updateScores();
            setMessage(`${GameLogic.getCurrentPlayer().getName()}'s turn (${GameLogic.getCurrentPlayer().getMark()})`);

            // 🔥 Switch views
            document.querySelector('.player-info').style.display = 'none';
            document.querySelector('.game').style.display = 'grid';
            document.querySelector('.scoreboard').style.display = 'grid';

            
            // 🔥 Now bind cell click events since the game has officially started
            cells.forEach(cell => {
                cell.addEventListener('click', handleCellClick);
            });

            cells.forEach(cell => {
                cell.style.backgroundColor = 'bisque';
                
                cell.addEventListener('mouseover', handleMouseOver);
                cell.addEventListener('mouseout', handleMouseOut);

            });

            resetButton.disabled = false;
    
            renderBoard();
        });
    };

    function handleMouseOver(e) {
        e.target.style.backgroundColor = "lightblue";
    }

    function handleMouseOut(e) {
        e.target.style.backgroundColor = 'bisque';
    }
    

    const init = () => {
        bindEvents();
        renderBoard();
        setMessage(`Enter player names and click "Start Game"`);
    };

    return { init };
})();



DisplayController.init();