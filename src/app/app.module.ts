import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, UrlMatchResult, UrlSegment } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnwrapDirective } from './unwrap.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnwrapDirective,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      {
        component: HomeComponent,
        // Hack-around to avoid reinitializing the component when changing from /home to /home/123
        // (needed for animations)
        matcher: (segments: UrlSegment[]): UrlMatchResult | null => {
          if (segments[0].path === 'home') {
            if (segments.length === 1) {
              return {
                consumed: segments,
                posParams: {},
              };
            } else if (segments.length === 2) {
              return {
                consumed: segments,
                posParams: { detailid: segments[1] }
              };
            }
          }

          return null;
        }
      },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
