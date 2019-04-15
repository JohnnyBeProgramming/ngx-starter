import { HttpClient } from '@angular/common/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  TranslateService,
  TranslateModule,
  TranslateLoader
} from '@ngx-translate/core';
import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

export const BootstrapTranslationService = {
  provide: APP_INITIALIZER,
  useFactory: InitTranslationService,
  deps: [TranslateService],
  multi: true
};

export function InitTranslationService(
  translateService: TranslateService
): () => Promise<string> {
  return () => {
    const lang = 'en';
    if (translateService) {
      console.log('Set language:', lang);
      translateService.setDefaultLang(lang);
      translateService.use(lang);
      return Promise.resolve(lang);
    } else {
      return Promise.reject(new Error('TranslateService not found!'));
    }
  };
}

export function TranslateLoaderForCommon(http: HttpClient) {
  const target = 'common';
  console.log('Set translations for', [target]);
  return new TranslateHttpLoader(http, `/assets/lang/${target}/`, '.json');
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderForCommon,
        deps: [HttpClient]
      },
      isolate: false
    })
  ],
  exports: [TranslateModule]
})
export class CommonAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonAppModule,
      providers: []
    };
  }
}
