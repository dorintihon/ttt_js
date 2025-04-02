const Gameboard = {
    board: new Array(9).fill(null),

    printBoard: function() {
        console.log(this.board);
    },

    resetBoard: function() {
        this.board = new Array(9).fill(null);
    },

    return{
        printBoard,
        resetBoard
    }
}

const Player = (name, mark) => {
    return {name, mark}
}



