import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './game.component';

const ROUTES: Routes = [
    //{ path: '', redirectTo: '/game', pathMatch: 'full' },
    //{ path: 'game', component: GameComponent }
    //{ path: 'help', component: HelpComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(ROUTES) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }