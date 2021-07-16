import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@familyChat/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingPage } from './containers/setting.page';
import { SettingPageRoutingModule } from './setting-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
  ],
  declarations: [SettingPage]
})
export class SettingPageModule {}
