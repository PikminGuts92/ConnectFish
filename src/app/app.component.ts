import { Component, OnInit } from '@angular/core';
import './board-state.ts';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
    public title: string = 'Connect Fish';
    private game: BoardState;

    ngOnInit() {
        this.game = new BoardState(6, 7);
    }
}