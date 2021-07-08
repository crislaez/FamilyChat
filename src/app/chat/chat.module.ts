import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@familyChat/shared/auth/auth.module';
import { ChatroomModule } from '@familyChat/shared/chatroom/chatroom.module';
import { SharedModule } from '@familyChat/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './containers/chat.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    AuthModule,
    ChatroomModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
