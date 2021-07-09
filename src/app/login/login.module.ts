import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@familyChat/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LoginPage } from './containers/login.page';
import { LoginPageRoutingModule } from './login-routing.module';
import { AuthModule } from '@familyChat/shared/auth/auth.module';
import { ChatroomModule } from '@familyChat/shared/chatroom/chatroom.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    // AuthModule,
    // ChatroomModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
