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

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    };

    const setMark = (index, mark) => {
        if (index < 0 || index > 8) {
            console.log("Invalid index");
            return;
        }
        if (board[index] !== null) {
            console.log("Square already taken");
            return;
        }
        board[index] = mark;
    }

    const getSquare = (index) => {
        if (index < 0 || index > 8) {
            console.log("Invalid index");
            return;
        }
        return board[index];
    }

    const isFull = () => {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                return false;
            }
        }
        return true;
    }

    return {
        printBoard,
        resetBoard,
        setMark,
        getSquare,
        isFull
    };
})();


const Player = (name, mark) => {
    
    const getName = () => {
        return name;
    };
    const getMark = () => {
        return mark;
    }

    const setName = (newName) => {
        name = newName;
    }
    const setMark = (newMark) => {
        mark = newMark;
    }

    return {
        getName,
        getMark,
        setName,
        setMark
    };
}

const GameLogic = (() => {
    const players = [
        Player("Player 1", "X"),
        Player("Player 2", "O")
    ];

    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const makeMove = (index) => {
        if (Gameboard.getSquare(index) !== null) {
            console.log("Square already taken");
            return;
        }
        Gameboard.setMark(index, currentPlayer.getMark());
    }

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
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (Gameboard.getSquare(a) === mark && Gameboard.getSquare(b) === mark && Gameboard.getSquare(c) === mark) {
                return true;
            }
        }
        return false;
    };

    const checkDraw = () => {
        return Gameboard.isFull();
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = players[0];
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
        });
        document.querySelector('.player').textContent = `${currentPlayer.getName()}'s turn (${currentPlayer.getMark()})`;
    };

    return {
        checkWin,
        checkDraw,
        resetGame,
        makeMove,
        getCurrentPlayer,
        switchPlayer,
    };
})();


document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
        let text = document.querySelector('.player');
        const index = parseInt(e.target.getAttribute('id'));
        let currentPlayer = GameLogic.getCurrentPlayer();
        
        if (Gameboard.getSquare(index) !== null) return; // prevent overwrite
        
        e.target.textContent = currentPlayer.getMark();
        GameLogic.makeMove(index);

        if (GameLogic.checkWin(currentPlayer.getMark())) {
            text.textContent = `${currentPlayer.getName()} wins!`;
            return;
        } else if (GameLogic.checkDraw()) {
            text.textContent = "It's a draw!";
            return;
        } else {
            GameLogic.switchPlayer();
            currentPlayer = GameLogic.getCurrentPlayer();
            text.textContent = `${currentPlayer.getName()}'s turn (${currentPlayer.getMark()})`;
        }
    }); 
});



// Reset button functionality
document.querySelector('.reset').addEventListener('click', () => {
    GameLogic.resetGame();
});

