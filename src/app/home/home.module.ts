import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@familyChat/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './containers/home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { AuthModule } from '@familyChat/shared/auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    AuthModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
