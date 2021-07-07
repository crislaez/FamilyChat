import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { gotToTop, trackById } from '@familyChat/shared/shared/utils/utils';
import { IonContent } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { AuthActions } from '@familyChat/shared/auth';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-home',
  template: `
  <ion-header no-border >
    <ion-toolbar mode="md|ios">
      <ion-title class="text-color" >{{'COMMON.CHAT_TITLE' | translate}}</ion-title>

      <ion-button fill="clear" size="small" slot="end" (click)="presentActionSheet()">
        <ion-icon class="text-color" name="menu-outline"></ion-icon>
      </ion-button>
    </ion-toolbar>
   </ion-header>


  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
    <div class="container components-color">


      <!-- REFRESH -->
      <!-- <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher> -->

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <div class="error-serve">
          <span class="text-second-color">{{'COMMON.NORESULT' | translate}}</span>
        </div>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <ion-spinner class="loadingspinner"></ion-spinner>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>

  </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  @ViewChild(IonContent, {static: true}) content: IonContent;
  gotToTop = gotToTop;
  trackById = trackById;
  showButton: boolean = false;


  constructor(public actionSheetController: ActionSheetController, private store: Store) { }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'LogOut',
        role: 'destructive',
        icon: 'log-out',
        handler: () => {
          this.store.dispatch(AuthActions.logout())
        }
      }]
    });
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
  }

}
