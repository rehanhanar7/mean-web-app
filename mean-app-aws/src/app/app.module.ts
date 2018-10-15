import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//page components
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';

//routers
import {routing, mainRoutingProviders} from './main.route';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    routing,
    mainRoutingProviders
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
