
// Constants
const CONNECT: number = 4;

export enum Slot {
    Empty = 0,
    Player1 = 1,
    Player2 = 2
}

export class BoardState {
    /*   0 1 2 3 . . c
     * 1 0 0 0 0 0 0 0
     * 2 0 . . . . . 0
     * 3 0 . . . . . 0
     * . 0 . . . . . 0
     * . 0 . . . . . 0
     * r 0 0 0 0 0 0 0
     */
    public board: Slot[][];
    private _playerTurn: boolean; // F: Player 1, T: Player 2
    private _lastMove: number;

    // Rating stuff
    private _rating: number;
    private _p1Solutions: number;
    private _p2Solutions: number;

    // Properties
    public get playerTurn(): boolean { return this._playerTurn; }
    public get player1Solutions(): number { return this._p1Solutions; }
    public get player2Solutions(): number { return this._p2Solutions; }
    public get rating(): number { return this._rating; }
    public get lastMove(): number { return this._lastMove; }

    constructor(private readonly _rowSize: number, private readonly _colSize: number, pTurn: number = 1) {
        this.reset(pTurn);
    }

    /// Copy constructor
    public static copy(oldBoard: BoardState): BoardState {
        // Copies all values
        let newBoard = new BoardState(oldBoard._rowSize, oldBoard._colSize);
        newBoard._playerTurn = oldBoard._playerTurn;

        // Copies slots from old board to new board
        for (let i: number = 0; i < newBoard._rowSize; i++) {
            newBoard.board[i] = [newBoard._colSize];

            for (let j: number = 0; j < newBoard._colSize; j++) {
                newBoard.board[i][j] = oldBoard.board[i][j];
            }
        }
        
        return newBoard;
    }

    public reset(pTurn: number = 1): void {
        // Sets player turn to P1
        this._playerTurn = (pTurn === 2);
        this._lastMove = -1;

        this.board = [];

        // Initializes board to empty
        for (let i = 0; i < this._rowSize; i++) {
            this.board[i] = [this._colSize];

            for (let j = 0; j < this._colSize; j++) {
                this.board[i][j] = Slot.Empty;
            }
        }
        
        // Resets ratings
        this._rating = 0;
        this._p1Solutions = 0;
        this._p2Solutions = 0;
    }

    private legalMove(column: number, player: boolean): boolean {
        // Returns false if out of bounds
        if (player != this._playerTurn || column < 0 || column >= this._colSize)
            return false;
        
        // Checks every slot in column from the top
        // Returns true as soon as an empty slot if found
        for (let row = 0; row < this._rowSize; row++) {
            if (this.board[row][column] === Slot.Empty) return true;
        }

        return false;
    }

    public commitMove(column: number, player: boolean): number {
        // Returns -1 if illegal move
        if (!this.legalMove(column, player)) return -1;

        let row = 0;

        // Finds last empty row in column
        while (row < this._rowSize)
        {
            // Breaks if filled slot if found
            if (this.board[row][column] != Slot.Empty)
                break;
            
            row++;
        }

        // Decrements row
        if (row != 0) row--;

        // Commits move
        this.board[row][column] = (player ? Slot.Player2 : Slot.Player1);
        this._playerTurn = !this._playerTurn;

        // TODO: Re-calculates rating

        // Returns row index
        return row;
    }
}