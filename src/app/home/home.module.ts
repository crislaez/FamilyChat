import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@familyChat/shared/auth/auth.module';
import { ChatroomModule } from '@familyChat/shared/chatroom/chatroom.module';
import { SharedModule } from '@familyChat/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './containers/home.page';
import { SearchPage } from './containers/search.page';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    // AuthModule,
    // ChatroomModule
  ],
  declarations: [
    HomePage,
    SearchPage
  ]
})
export class HomePageModule {}
