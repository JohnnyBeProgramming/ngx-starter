import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';

import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateMessageFormatCompiler,
  MESSAGE_FORMAT_CONFIG
} from 'ngx-translate-messageformat-compiler';
import {
  InitTranslationService,
  BootstrapTranslationService,
  CommonAppModule,
  TranslateLoaderForCommon
} from '../common';

export const routes = [{ path: '', loadChildren: '@test/home' }];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NxModule.forRoot(),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderForCommon,
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      },
      isolate: true
    }),
    CommonAppModule.forRoot(),
  ],
  providers: [BootstrapTranslationService],
  bootstrap: [AppComponent]
})
export class AppModule {}
