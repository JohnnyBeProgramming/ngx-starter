import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  Inject,
  Provider,
  ANALYZE_FOR_ENTRY_COMPONENTS
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Routes,
  ExtraOptions,
  ROUTER_CONFIGURATION,
  ROUTES,
  PreloadingStrategy,
  NoPreloading
} from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { I18nModule, I18nConfig, I18nConfigToken } from '@test/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { StateClass } from '@ngxs/store/src/internal/internals';

// Declare the common application config parts
export interface AppModuleConfig {
  name: string;
  routes?: Routes;
  states?: StateClass[];
  i18n?: I18nConfig;
  analytics?: any;
}

export interface AppModuleRootConfig extends AppModuleConfig {
  routeConfig?: ExtraOptions;
  environment?: {
    production: boolean;
    [setting: string]: any;
  };
}

// Declare a token that can be used to retreive the current module config
export const AppModuleConfigToken = new InjectionToken<AppModuleConfig>(
  'AppModuleConfig'
);

@NgModule({
  imports: [CommonModule]
})
export class AppCommonModule {
  // Initialise resources per (potentially lazy loaded) feature in the constructor below
  constructor(@Inject(AppModuleConfigToken) public config: AppModuleConfig) {}

  /**
   * To be called in the root 'AppModule' and should only be called once
   */
  static forRoot(config?: AppModuleRootConfig): ModuleWithProviders {
    // Return a module that indirectly exposes AppCommonModule, with the
    // imported modules initialized using the method `forRoot()`
    return {
      ngModule: AppRootModule, // tslint:disable-line
      providers: AppCommonModule.getRootProvidersFor(config || { name: 'root' })
    };
  }

  /**
   * To be called by lazy loaded feature modules
   */
  static forFeature(config: AppModuleConfig): ModuleWithProviders {
    // Return a module that indirectly exposes AppCommonModule, with the
    // imported modules initialized using the method `forChild()` or `forFeature()`
    return {
      ngModule: AppFeatureModule, // tslint:disable-line
      providers: AppCommonModule.getProvidersFor(config)
    };
  }

  static getRootProvidersFor(config: AppModuleRootConfig): Provider[] {
    const providers: Provider[] = [];

    // Register routing and its configuration providers
    const { routeConfig } = config;
    if (routeConfig) {
      providers.push(
        {
          provide: ROUTER_CONFIGURATION,
          useValue: routeConfig
        },
        {
          provide: PreloadingStrategy,
          useExisting:
            routeConfig && routeConfig.preloadingStrategy
              ? routeConfig.preloadingStrategy
              : NoPreloading
        }
      );
    }

    // Redefine the state from the provided state config (or empty)
    const { states, environment } = config;
    const isDev = environment ? !environment.production : true;
    const rootStates = states || [];
    const updatedProviders = [
      ...NgxsModule.forRoot(rootStates, { developmentMode: isDev }).providers,
      ...NgxsReduxDevtoolsPluginModule.forRoot({ disabled: !isDev }).providers
    ];
    providers.push(...updatedProviders);

    return providers.concat(AppCommonModule.getProvidersFor(config));
  }

  static getProvidersFor(config: AppModuleConfig): Provider[] {
    const providers: Provider[] = [
      // Declare the app module config
      {
        provide: AppModuleConfigToken,
        useValue: config
      }
    ];

    // Register routing and its configuration providers
    const { routes } = config;
    if (routes) {
      providers.push(
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          multi: true,
          useValue: routes
        },
        { provide: ROUTES, multi: true, useValue: routes }
      );
    }

    const { i18n } = config;
    if (i18n) {
      providers.push({
        provide: I18nConfigToken,
        useValue: i18n
      });
    }

    const { states } = config;
    if (states) {
      providers.push(...NgxsModule.forFeature(states).providers);
    }

    return providers;
  }
}

@NgModule({
  imports: [
    AppCommonModule,
    TranslateModule,
    I18nModule.forRoot(),
    NgxsModule.forRoot([], { developmentMode: false }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: true
    })
    // RouterModule.forRoot([], { initialNavigation: 'enabled' })
  ],
  exports: [AppCommonModule, TranslateModule, I18nModule, NgxsModule]
})
export class AppRootModule {
  constructor(@Inject(AppModuleConfigToken) public config: AppModuleConfig) {
    console.log(' --> Root Loaded', config);
  }
}

@NgModule({
  imports: [
    AppCommonModule,
    TranslateModule.forChild(),
    I18nModule.forFeature({
      componentName: 'common'
    }),
    NgxsModule.forFeature([]),
    // RouterModule.forChild([{ path: '', component: HomeFeatureComponent }]),
  ],
  exports: [AppCommonModule, TranslateModule, I18nModule, NgxsModule]
})
export class AppFeatureModule {
  constructor(@Inject(AppModuleConfigToken) public config: AppModuleConfig) {
    console.log(' --> Lazy Loaded', config);
  }
}
