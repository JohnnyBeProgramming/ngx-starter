import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
  TranslateCompiler
} from '@ngx-translate/core';
import {
  NgModule,
  ModuleWithProviders,
  APP_INITIALIZER,
  InjectionToken,
  Inject,
  Injectable
} from '@angular/core';
import { CommonModule } from '@angular/common';

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

export function InitTranslationService(translate: TranslateService) {
  return () => {
    const lang = 'en';
    if (translate) {
      console.log('Set language:', lang);
      translate.setDefaultLang(lang);
      translate.use(lang);
      return Promise.resolve(lang);
    } else {
      return Promise.reject(new Error('TranslateService not found!'));
    }
  };
}

export interface I18nConfig {
  componentName: string;
}

export const I18nConfigToken = new InjectionToken<I18nConfig>('I18nConfig');

@Injectable({
  providedIn: 'root'
})
export class I18nConfigService {
  constructor(
    @Inject(I18nConfigToken)
    public config: I18nConfig
  ) {}
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
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      },
      isolate: false
    })
    */
    TranslateModule.forRoot({
      loader: I18nModule.FeatureTranslateLoader,
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      },
      isolate: true
    })
  ],
  exports: [TranslateModule]
})
export class I18nModule {
  // Define a generic provider that will resolve and load the configured translations
  static FeatureTranslateLoader = {
    provide: TranslateLoader,
    useFactory: I18nModule.loadTranslationsForFeature,
    deps: [HttpClient, I18nConfigService]
  };

  // To be called in the root 'AppModule' and should only be called once
  static forRoot(config?: I18nConfig): ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [
        // Define the base applications confiiguration or default to
        // common translations
        I18nConfigService,
        {
          provide: I18nConfigToken,
          useValue: config || {
            componentName: 'common'
          }
        },
      ]
    };
  }

  // To be called by lazy loaded feature modules
  static forFeature(config: I18nConfig): ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [
        // Define the feature specifi translation options
        I18nConfigService,
        {
          provide: I18nConfigToken,
          useValue: config
        }
      ]
    };
  }

  static loadTranslationsForFeature(
    http: HttpClient,
    configService: I18nConfigService
  ) {
    const target = configService.config.componentName;
    return new TranslateHttpLoader(http, `/assets/lang/${target}/`, '.json');
  }

  constructor(
    public configService: I18nConfigService,
    private translate: TranslateService
  ) {
    // We need to initialize each lazy loaded module forits translations to be set
    this.setTranslations('en');
  }

  setTranslations(lang: string) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }
}
