import { List } from "./list";
import { BoardState } from './board-state';

// Constants
const MAX_INT: number = (2**31) - 1;
const MIN_INT: number = -(2**31);

export class ComRoutines {
    public static getNextStates(bs: BoardState, maxPlayer: boolean): List<BoardState> {
        let moves = bs.possibleMoves();
        let states = new List<BoardState>();

        // Creates next states by possible moves
        for (let move of moves.toArray()) {
            let nextState = BoardState.copy(bs);
            nextState.commitMove(move, bs.playerTurn);

            states.add(nextState);
        }

        // Sorts states by rating
        if (maxPlayer) {
            // Big numbers first
            states.sort((a, b): number => {
                //return b.rating - a.rating;
                if (a.rating < b.rating) return 1;
                else if (a.rating > b.rating) return -1;
                else return 0;
            });
        }
        else {
            // Small numbers first
            states.sort((a, b): number => {
                //return a.rating - b.rating;
                if (a.rating > b.rating) return 1;
                else if (a.rating < b.rating) return -1;
                else return 0;
            });
        }

        return states;
    }

    public static findbestMove(bs: BoardState, lookahead: number, player: boolean): number {
        return this.alphabeta(bs, lookahead, MIN_INT, MAX_INT, !player)[1]; // Best move index
    }

    private static alphabeta(bs: BoardState, depth: number, alpha: number, beta: number, maxPlayer: boolean): number[] {
        let bestMove = -1; // Best rating, best move
        let nextStates = this.getNextStates(bs, maxPlayer);

        if (depth === 0 || bs.player1Solutions > 0 || bs.player2Solutions > 0 || nextStates.count === 0)
            return [ bs.rating, bestMove ];

        if (maxPlayer) {
            for (let nextState of nextStates.toArray()) {
                let ratingResult = this.alphabeta(nextState, depth - 1, alpha, beta, false);

                // Sets max alpha
                if (ratingResult[0] > alpha) {
                    alpha = ratingResult[0];
                    bestMove = nextState.lastMove;
                }

                // Beta custs off
                if (beta <= alpha) break;
            }

            return [alpha, bestMove];
        }
        else {
            for (let nextState of nextStates.toArray()) {
                let ratingResult = this.alphabeta(nextState, depth - 1, alpha, beta, true);

                // Sets min beta
                if (ratingResult[0] < beta) {
                    beta = ratingResult[0];
                    bestMove = nextState.lastMove;
                }

                // Alpha custs off
                if (beta <= alpha) break;
            }

            return [beta, bestMove];
        }
    }
}