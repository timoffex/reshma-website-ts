import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CardGridComponent } from './card-grid/card-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    CardGridComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: CardGridComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
