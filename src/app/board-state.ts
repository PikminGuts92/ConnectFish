enum Slot {
    Empty = 0,
    Player1 = 1,
    Player2 = 2
}

class BoardState {
    /*   0 1 2 3 . . c
     * 1 0 0 0 0 0 0 0
     * 2 0 . . . . . 0
     * 3 0 . . . . . 0
     * . 0 . . . . . 0
     * . 0 . . . . . 0
     * r 0 0 0 0 0 0 0
     */
    public board: Slot[][];
    private playerTurn: boolean; // F: Player 1, T: Player 2
    private lastMove: number;
    private static CONNECT: number = 4;

    // Rating stuff
    private rating: number;
    private p1Solutions: number;
    private p2Solutions: number;

    constructor(private readonly rowSize: number, private readonly colSize: number, pTurn: number = 1) {
        this.reset(pTurn);
    }

    /// Copy constructor
    public static copy(oldBoard: BoardState): BoardState {
        // Copies all values
        let newBoard = new BoardState(oldBoard.rowSize, oldBoard.colSize);
        newBoard.playerTurn = oldBoard.playerTurn;

        // Copies slots from old board to new board
        for (let i: number = 0; i < newBoard.rowSize; i++) {
            newBoard.board[i] = [newBoard.colSize];

            for (let j: number = 0; j < newBoard.colSize; j++) {
                newBoard.board[i][j] = oldBoard.board[i][j];
            }
        }

        return newBoard;
    }

    public reset(pTurn: number = 1): void {
        // Sets player turn to P1
        this.playerTurn = (pTurn === 2);
        this.lastMove = -1;

        this.board = [];

        // Initializes board to empty
        for (let i: number = 0; i < this.rowSize; i++) {
            this.board[i] = [this.colSize];

            for (let j: number = 0; j < this.colSize; j++) {
                this.board[i][j] = Slot.Empty;
            }
        }

        // Resets ratings
        this.rating = 0;
        this.p1Solutions = 0;
        this.p2Solutions = 0;
    }
}