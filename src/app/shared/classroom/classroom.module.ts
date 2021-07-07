import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassroomPageRoutingModule } from './classroom-routing.module';

import { ClassroomPage } from './classroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassroomPageRoutingModule
  ],
  declarations: [ClassroomPage]
})
export class ClassroomPageModule {}
