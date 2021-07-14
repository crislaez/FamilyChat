import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatGuard } from '@familyChat/shared/auth';
import { ChatPage } from './containers/chat.page';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: ':chatRoomKey',
        component: ChatPage,
        canActivate: [ChatGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
