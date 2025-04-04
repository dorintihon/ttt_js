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
    const players = [
        Player("Dorin", "X"),
        Player("Doina", "O")
    ];

    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
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

    const checkWin = (mark) => winningCombinations.some(([a, b, c]) =>
        [a, b, c].every(i => Gameboard.getSquare(i) === mark)
    );

    const checkDraw = () => {
        return Gameboard.isFull();
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = players[0];
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
    };
})();


const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const message = document.querySelector('.player');
    const resetButton = document.querySelector('.reset');
    const player1Score = document.querySelector('.player1-score');
    const player2Score = document.querySelector('.player2-score');

    const renderBoard = () => {
        Gameboard.getBoard().forEach((mark, index) => {
            cells[index].textContent = mark === null ? "" : mark;
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
            currentPlayer.addScore();
            updateScores();
            removeCellClickEvents(); // Disable further clicks
            return;
        }else if (GameLogic.checkDraw()) {
            setMessage("It's a draw!");
            removeCellClickEvents(); // Disable further clicks
            return;
        } else {
            GameLogic.switchPlayer();
            const nextPlayer = GameLogic.getCurrentPlayer();
            setMessage(`${nextPlayer.getName()}'s turn (${nextPlayer.getMark()})`);
        }
    };

    const bindEvents = () => {
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        resetButton.addEventListener('click', () => {
            GameLogic.resetGame();
            cells.forEach(cell => cell.addEventListener('click', handleCellClick));
            renderBoard();
            setMessage(`Player X Choose a square`);
        });
    };

    const init = () => {
        bindEvents();
        renderBoard();
        setMessage(`Player X Choose a square`);
    };

    return { init };
})();



DisplayController.init();