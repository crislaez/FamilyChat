import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RootComponent } from './layout/root.page';
import { RouterModule } from '@angular/router';
import { AuthModule } from '@familyChat/shared/auth/auth.module';
import { ChatroomModule } from '@familyChat/shared/chatroom/chatroom.module';
import { UserModule } from '@familyChat/shared/user/user.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TranslateModule.forChild(),
    AuthModule,
    ChatroomModule,
    UserModule
  ],
  declarations: [RootComponent]
})
export class CoreModule {}
