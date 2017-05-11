import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { HttpModule }               from '@angular/http';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';

// Material design
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdListModule, MdGridListModule, MdSlideToggleModule, MdTabsModule } from '@angular/material';

import { AppComponent }     from './app.component';
import { GameComponent }    from './game.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // Material design
        MdButtonModule,
        MdCheckboxModule,
        MdInputModule,
        MdListModule,
        MdGridListModule,
        MdSlideToggleModule,
        MdTabsModule
    ],
    declarations: [
        AppComponent,
        GameComponent
        ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }