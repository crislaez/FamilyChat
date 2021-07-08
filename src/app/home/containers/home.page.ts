import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { gotToTop, trackById } from '@familyChat/shared/shared/utils/utils';
import { IonContent } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { AuthActions } from '@familyChat/shared/auth';
import { select, Store } from '@ngrx/store';
import { Chatroom, fromChatroom } from '@familyChat/shared/chatroom';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
  <ion-header no-border >
    <ion-toolbar mode="md|ios">
      <ion-title class="text-color" >{{'COMMON.CHAT_TITLE' | translate}}</ion-title>

      <ion-button fill="clear" size="small" slot="end" (click)="presentActionSheet()">
        <!-- <ion-icon class="text-color" name="menu-outline"></ion-icon> -->
        <ion-icon class="text-color" name="settings-outline"></ion-icon>
      </ion-button>
    </ion-toolbar>
   </ion-header>


  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
    <div class="container components-color">

      <ng-container *ngIf="(chatrooms$ | async) as chatrooms">
        <ng-container *ngIf="!(pending$ | async); else loader">
          <ng-container *ngIf="chatrooms?.length > 0; else noData">

            <ion-list>
              <ion-item *ngFor="let chatroom of chatrooms; trackBy: trackById" [routerLink]="['/chat/'+chatroom?.$key]">
                <ion-avatar slot="start">
                  <img [src]="chatroom?.value?.image">
                </ion-avatar>
                <ion-label>
                  <h2>{{chatroom?.value?.name}}</h2>
                  <!-- <p>-</p>
                  <p>-</p> -->
                </ion-label>
              </ion-item>
            </ion-list>


          </ng-container>
        </ng-container>
      </ng-container>


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

  pending$: Observable<boolean> = this.store.pipe(select(fromChatroom.getPending));
  chatrooms$: Observable<Chatroom[]> = this.store.pipe(select(fromChatroom.getChatrooms));


  constructor(public actionSheetController: ActionSheetController, private store: Store) {
    // this.chatrooms$.subscribe(data => console.log(data))
  }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Edit',
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



