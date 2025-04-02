const Gameboard = (() => {
    const board = new Array(9).fill(null);

    const printBoard = () => {
        console.log(board);
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    };

    const setMark = (index, mark) => {
        if (board[index] === null) {
            board[index] = mark;
        }
    };

    return {
        printBoard,
        resetBoard,
        setMark
    };
})();


const Player = (name, mark) => {
    return {name, mark}
}

const GameLogic = (() => {
    const players = [Player('Player 1', 'X'), Player('Player 2', 'O')];
    let currentPlayer = players[0];

    const changePlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    return {
        changePlayer,
        getCurrentPlayer
    };
})();



