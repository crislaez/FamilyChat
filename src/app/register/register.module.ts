import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@familyChat/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterPage } from './containers/register.page';
import { RegisterPageRoutingModule } from './register-routing.module';
import { AuthModule } from '@familyChat/shared/auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    AuthModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
