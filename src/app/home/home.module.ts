import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@familyChat/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './containers/home.page';
import { SearchPage } from './containers/search.page';
import { HomePageRoutingModule } from './home-routing.module';
import { LottieModule } from 'ngx-lottie'; // add this line

export function playerFactory() { // add this line
  return import('lottie-web'); // add this line
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    LottieModule.forRoot({ player: playerFactory }),
    // AuthModule,
    // ChatroomModule
  ],
  declarations: [
    HomePage,
    SearchPage
  ]
})
export class HomePageModule {}
