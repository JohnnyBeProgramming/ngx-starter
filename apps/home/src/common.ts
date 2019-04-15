import { HttpClient } from '@angular/common/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
  TranslateCompiler
} from '@ngx-translate/core';
import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

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

export function TranslateLoaderForFeature(componentName: string) {
  return (http: HttpClient) => {
    console.log('Set translations for', [componentName]);
    return new TranslateHttpLoader(
      http,
      `/assets/lang/${componentName}/`,
      '.json'
    );
  };
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    /*
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderForFeature('common'),
        deps: [HttpClient]
      },
      isolate: false
    })
    */
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderForFeature('common'),
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      },
      isolate: true
    })
  ],
  exports: [TranslateModule]
})
export class MockedI18nModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MockedI18nModule,
      providers: []
    };
  }

  constructor(translate: TranslateService) {
    const lang = 'en';
    translate.setDefaultLang(lang);
    translate.use(lang);
  }
}
