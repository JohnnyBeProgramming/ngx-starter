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
    TranslateModule.forRoot({
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

        // Load the feaature translations using the config defined above
        I18nModule.FeatureTranslateLoader,
      ]
    };
  }

  // To be called by lazy loaded feature modules
  static forFeature(config: I18nConfig): ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [
        // Define the feature specific translation options
        I18nConfigService,
        {
          provide: I18nConfigToken,
          useValue: config
        },

        // Load the feaature translations using the config defined above
        I18nModule.FeatureTranslateLoader,
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
