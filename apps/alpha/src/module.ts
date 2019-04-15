import { NgModule } from '@angular/core';

import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlphaState } from './state';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@test/i18n';
import { AlphaFeatureComponent } from './app/alpha-feature/alpha-feature.component';

@NgModule({
  declarations: [AlphaFeatureComponent],
  imports: [
    CommonModule,

    NxModule.forRoot(),
    RouterModule.forChild([{ path: '', component: AlphaFeatureComponent }]),
    NgxsModule.forFeature([AlphaState]),
    TranslateModule.forChild(),
    I18nModule.forFeature({
      componentName: 'alpha'
    })
  ],
  providers: [],
  bootstrap: [AlphaFeatureComponent]
})
export class FeatureModule {}

export default FeatureModule;
