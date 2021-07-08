import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChatroomEffects } from './effects/chatroom.effects';
import * as fromChatroom from './reducers';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreModule.forFeature(fromChatroom.chatroomKey, fromChatroom.reducer),
    EffectsModule.forFeature([ChatroomEffects]),
  ]
})
export class ChatroomModule {}
