import { Component, OnInit } from '@angular/core';

import { BoardState } from './board-state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
    public title: string = 'Connect Fish';
    public version: string = 'Version 1.0';

    ngOnInit() { }
}