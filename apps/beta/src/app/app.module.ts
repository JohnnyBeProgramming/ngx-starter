import { AppCommonModule } from '@test/common';
import { I18nModule } from '@test/i18n';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { HttpClientModule } from '@angular/common/http';

import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';

export const routes = [{ path: '', loadChildren: '@test/beta' }];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,

    NxModule.forRoot(),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    AppCommonModule.forRoot({
      name: 'root',
      //routes: routes,
      //routeConfig: { initialNavigation: 'enabled' },
      environment
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
