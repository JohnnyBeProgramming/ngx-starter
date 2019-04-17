import { NgModule } from '@angular/core';

import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BetaState } from './state';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@test/i18n';
import { BetaFeatureComponent } from './app/beta-feature/beta-feature.component';
import { AppCommonModule } from '@test/common';

@NgModule({
  declarations: [BetaFeatureComponent],
  imports: [
    CommonModule,

    NxModule.forRoot(),
    RouterModule.forChild([{ path: '', component: BetaFeatureComponent }]),
    AppCommonModule.forFeature({
      name: 'beta',
      i18n: {
        componentName: 'beta'
      },
      states: [BetaState]
    }),
  ],
  providers: [],
  bootstrap: [BetaFeatureComponent]
})
export class FeatureModule {}

export default FeatureModule;
