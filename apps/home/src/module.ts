import { NgModule, APP_INITIALIZER } from '@angular/core';

import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeFeatureComponent } from './app/home-feature/home-feature.component';
import { HomeState } from './state';
import { NgxsModule } from '@ngxs/store';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InitTranslationService } from './common';

export function TranslateLoaderForHome(http: HttpClient) {
  const target = 'home';
  console.log('Set translations for', [target]);
  return new TranslateHttpLoader(http, `/assets/lang/${target}/`, '.json');
}

@NgModule({
  declarations: [HomeFeatureComponent],
  imports: [
    CommonModule,
    NxModule.forRoot(),
    RouterModule.forChild([{ path: '', component: HomeFeatureComponent }]),
    NgxsModule.forFeature([HomeState]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderForHome,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [],
  bootstrap: [HomeFeatureComponent]
})
export class FeatureModule {
  constructor(translate: TranslateService) {
    const lang = 'en';
    console.log('Load translations for', [lang]);
    translate.setDefaultLang(lang);
    translate.use(lang);
  }
}

export default FeatureModule;
