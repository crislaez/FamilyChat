import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './containers/chat.page';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: ':chatRoomKey',
        component: ChatPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
