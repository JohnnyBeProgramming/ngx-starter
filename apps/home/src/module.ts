import { AppCommonModule } from '@test/common';
import { NgModule } from '@angular/core';

import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeFeatureComponent } from './app/home-feature/home-feature.component';
import { HomeState } from './state';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@test/i18n';

@NgModule({
  declarations: [HomeFeatureComponent],
  imports: [
    CommonModule,

    NxModule.forRoot(),
    RouterModule.forChild([{ path: '', component: HomeFeatureComponent }]),
    AppCommonModule.forFeature({
      name: 'home',
      i18n: {
        componentName: 'home'
      },
      states: [HomeState]
    }),
  ],
  providers: [],
  bootstrap: [HomeFeatureComponent]
})
export class FeatureModule {}

export default FeatureModule;
