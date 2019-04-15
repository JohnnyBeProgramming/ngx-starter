import { NgModule } from '@angular/core';

import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeFeatureComponent } from './app/home-feature/home-feature.component';
import { HomeState } from './state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [HomeFeatureComponent],
  imports: [
    CommonModule,
    NxModule.forRoot(),
    RouterModule.forChild([{ path: '', component: HomeFeatureComponent }]),
    NgxsModule.forFeature([HomeState])
  ],
  providers: [],
  bootstrap: [HomeFeatureComponent]
})
export class FeatureModule {}

export default FeatureModule;
