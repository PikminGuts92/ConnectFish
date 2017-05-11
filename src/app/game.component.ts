import { Component, Input, OnInit } from '@angular/core';

import { BoardState, Slot } from './board-state';
import { ComRoutines as CRS } from './comroutines';

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: [ './game.component.css' ],
})
export class GameComponent implements OnInit {
    public game: BoardState;

    constructor() {
        this.game = new BoardState(6, 7);
    }

    private doRandomMove(): void {
        let move = Math.floor(Math.random() * this.game.columnSize); // 0 - culumnSize
        this.game.commitMove(move, this.game.playerTurn);
    }

    ngOnInit(): void {
        this.doRandomMove();
    }

    onSelectSlot(row: number, col: number) {
        if (this.game.isOver) return;

        // Human plays
        this.game.commitMove(col, this.game.playerTurn);
        if (this.game.isOver) return;

        // Computer plays
        let bestMove = CRS.findbestMove(this.game, 5, this.game.playerTurn);
        this.game.commitMove(bestMove, this.game.playerTurn);
    }

    onReset(): void {
        // Resets board
        this.game.reset();
        
        // Computer plays
        this.doRandomMove();
    }
}