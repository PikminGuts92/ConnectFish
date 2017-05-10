import { List } from "./list";
import { Position } from "./position";

// Constants
const CONNECT: number = 4;
const MAX_INT: number = (2**31) - 1;
const MIN_INT: number = -(2**31);

export enum Slot {
    Empty = 0,
    Player1 = 1,
    Player2 = 2
}

export class BoardState {
    /*   0 1 2 3 . . c
     * 0 0 0 0 0 0 0 0
     * 1 0 . . . . . 0
     * 2 0 . . . . . 0
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
    public get debug(): boolean { return false; }

    constructor(private readonly _rowSize: number, private readonly _colSize: number, pTurn: number = 1) {
        this.reset(pTurn);
    }

    /// Copy constructor
    public static copy(oldBoard: BoardState): BoardState {
        // Copies all values
        let newBoard = new BoardState(oldBoard._rowSize, oldBoard._colSize);
        newBoard._playerTurn = oldBoard._playerTurn;
        newBoard._rating = oldBoard._rating;
        newBoard._lastMove = newBoard._lastMove;

        // Copies slots from old board to new board
        for (let i: number = 0; i < newBoard._rowSize; i++) {
            newBoard.board[i] = [newBoard._colSize];

            for (let j: number = 0; j < newBoard._colSize; j++) {
                newBoard.board[i][j] = oldBoard.board[i][j];
            }
        }

        newBoard._p1Solutions = oldBoard._p1Solutions;
        newBoard._p2Solutions = oldBoard._p2Solutions;
        
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

    public possibleMoves(): List<number> {
        let moves = new List<number>();

        for (let i = 0; i < this._colSize; i++) {
            if (this.board[0][i] === Slot.Empty) moves.add(i);
        }

        return moves;
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

        // Re-calculates rating
        let ratingResult = this.calculateRating(this.board);
        this._rating = ratingResult[0];
        this._p1Solutions = ratingResult[1];
        this._p2Solutions = ratingResult[2];

        // Updates last move
        this._lastMove = column;

        // Returns row index
        return row;
    }

    // Utility function
    private calculateRating(board: Slot[][]): number[] {
        let ratingSolutions = [ 0, 0, 0 ]; // Rating, p1 sol, p2 sol (Returned)
        let scores = [ 0, 0 ]; // p1 score, p2 score
        
        // Used to avoid overlapping crossings
        let p1Horizontals = new List<Position>();
        let p1Verticals = new List<Position>();
        let p1DiagonalsLeft = new List<Position>();
        let p1DiagonalsRight = new List<Position>();

        let p2Horizontals = new List<Position>();
        let p2Verticals = new List<Position>();
        let p2DiagonalsLeft = new List<Position>();
        let p2DiagonalsRight = new List<Position>();

        // Starts from the left column, bottom row
        for (let col = 0; col < this._colSize; col++) {
            for (let row = this._rowSize - 1; row >= 0; row--) {
                let color = this.board[row][col];
                if (color === Slot.Empty) break; // No discs should be above
                else if (color === Slot.Player1) {
                    // Player 1
                    // Evaluates disc placement (All return a value between 0 and 4)
                    let hResult = this.horizontalScore(board, row, col, color, p1Horizontals);
                    let vResult = this.verticalScore(board, row, col, color, p1Verticals);
                    let dlResult = this.diagonalScoreDown(board, row, col, color, p1DiagonalsLeft);
                    let drResult = this.diagonalScoreUp(board, row, col, color, p1DiagonalsRight);

                    // Adds to total
                    scores[0] += hResult[0] + vResult[0] + dlResult[0] + drResult[0];
                    ratingSolutions[1] += hResult[1] + vResult[1] + dlResult[1] + drResult[1];
                }
                else if (color === Slot.Player2) {
                    // Player 2
                    // Evaluates disc placement (All return a value between 0 and 4)
                    let hResult = this.horizontalScore(board, row, col, color, p2Horizontals);
                    let vResult = this.verticalScore(board, row, col, color, p2Verticals);
                    let dlResult = this.diagonalScoreDown(board, row, col, color, p2DiagonalsLeft);
                    let drResult = this.diagonalScoreUp(board, row, col, color, p2DiagonalsRight);

                    // Adds to total
                    scores[1] += hResult[0] + vResult[0] + dlResult[0] + drResult[0];
                    ratingSolutions[2] += hResult[1] + vResult[1] + dlResult[1] + drResult[1];
                }
            }
        }

        if (ratingSolutions[1] > 0) ratingSolutions[0] = MAX_INT; // Max
        else if (ratingSolutions[2] > 0) ratingSolutions[0] = MIN_INT; // Min
        else ratingSolutions[0] = scores[0] - scores[1]; // Difference

        return ratingSolutions;
    }

    private diagonalScoreDown(board: Slot[][], row: number, col: number, color: Slot, previous: List<Position>): number[] {
        let scores = [0, 0]; // score, solutionScore
        
        // Goes from left to right, from up to down (negative slope)
        for (let i = CONNECT - 1; i >= 0; i--) {
            let startCol = col - i;
            let startRow = row - i;
            let runningScore = 0;

            for (let ii = 0; ii < CONNECT; ii++) {
                let pos = new Position(startRow + ii, startCol + ii);

                // Skips if out of bounds
                if (!this.withinBounds(board, pos)) break;
                
                let selDisc = board[startRow + ii][startCol + ii];
                if (!(selDisc === Slot.Empty || selDisc === color) || previous.contains(pos)) break;

                // Checks if it's a solution
                if (selDisc === color) runningScore++;

                // Adds score (Last disc)
                if (ii === CONNECT - 1) {
                    previous.add(new Position(startRow, startCol));

                    if (runningScore === CONNECT) {
                        scores[0] += 1000;
                        scores[1]++;
                        continue;
                    }

                    // 1 = 2^0, 2 = 2^2, 3 = 2^4, 4 = 2^10
                    scores[0] += 1 << ((runningScore - 1) << 1); // 1, 4, 16, 64
                }
            }
        }

        return scores;
    }

    private diagonalScoreUp(board: Slot[][], row: number, col: number, color: Slot, previous: List<Position>): number[] {
        let scores = [0, 0]; // score, solutionScore
        
        // Goes from right to left, from down to up (negative slope)
        for (let i = CONNECT - 1; i >= 0; i--) {
            let startCol = col + i;
            let startRow = row - i;
            let runningScore = 0;

            for (let ii = 0; ii < CONNECT; ii++) {
                let pos = new Position(startRow + ii, startCol - ii);

                // Skips if out of bounds
                if (!this.withinBounds(board, pos)) break;
                
                let selDisc = board[startRow + ii][startCol - ii];
                if (!(selDisc === Slot.Empty || selDisc === color) || previous.contains(pos)) break;

                // Checks if it's a solution
                if (selDisc === color) runningScore++;

                // Adds score (Last disc)
                if (ii === CONNECT - 1) {
                    previous.add(new Position(startRow, startCol));

                    if (runningScore === CONNECT) {
                        scores[0] += 1000;
                        scores[1]++;
                        continue;
                    }

                    // 1 = 2^0, 2 = 2^2, 3 = 2^4, 4 = 2^10
                    scores[0] += 1 << ((runningScore - 1) << 1);
                }
            }
        }

        return scores;
    }

    private horizontalScore(board: Slot[][], row: number, col: number, color: Slot, previous: List<Position>): number[] {
        let scores = [0, 0]; // score, solutionScore
        
        // Goes from left to right
        for (let i = CONNECT - 1; i >= 0; i--) {
            let startCol = col - i;
            let startRow = row;
            let runningScore = 0;

            for (let ii = 0; ii < CONNECT; ii++) {
                let pos = new Position(startRow, startCol + ii);

                // Skips if out of bounds
                if (!this.withinBounds(board, pos)) break;
                
                let selDisc = board[startRow][startCol + ii];
                if (!(selDisc === Slot.Empty || selDisc === color) || previous.contains(pos)) break;

                // Checks if it's a solution
                if (selDisc === color) runningScore++;

                // Adds score (Last disc)
                if (ii === CONNECT - 1) {
                    previous.add(new Position(startRow, startCol));

                    if (runningScore === CONNECT) {
                        scores[0] += 1000;
                        scores[1]++;
                        continue;
                    }

                    // 1 = 2^0, 2 = 2^2, 3 = 2^4, 4 = 2^10
                    scores[0] += 1 << ((runningScore - 1) << 1);
                }
            }
        }
        
        return scores;
    }

    private verticalScore(board: Slot[][], row: number, col: number, color: Slot, previous: List<Position>): number[] {
        let scores = [0, 0]; // score, solutionScore
        
        // Goes from up to down
        for (let i = CONNECT - 1; i >= 0; i--) {
            let startCol = col;
            let startRow = row - i;
            let runningScore = 0;

            for (let ii = 0; ii < CONNECT; ii++) {
                let pos = new Position(startRow + ii, startCol);

                // Skips if out of bounds
                if (!this.withinBounds(board, pos)) break;
                
                let selDisc = board[startRow + ii][startCol];
                if (!(selDisc === Slot.Empty || selDisc === color) || previous.contains(pos)) break;

                // Checks if it's a solution
                if (selDisc === color) runningScore++;

                // Adds score (Last disc)
                if (ii === CONNECT - 1) {
                    previous.add(new Position(startRow, startCol));

                    if (runningScore === CONNECT) {
                        scores[0] += 1000;
                        scores[1]++;
                        continue;
                    }

                    // 1 = 2^0, 2 = 2^2, 3 = 2^4, 4 = 2^10
                    scores[0] += 1 << ((runningScore - 1) << 1);
                }
            }
        }

        return scores;
    }

    private withinBounds(board: Slot[][], pos: Position): boolean {
        // Returns false if out of bounds
        return !(pos.column < 0 || pos.column >= board[0].length
                || pos.row < 0 || pos.row >= board.length);
    }
}