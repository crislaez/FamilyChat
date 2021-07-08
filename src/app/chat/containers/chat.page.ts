import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatroomActions, fromChatroom } from '@familyChat/shared/chatroom';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { loadChatroom } from './../../shared/chatroom/actions/chatroom.actions';

@Component({
  selector: 'app-chat',
  template: `
  <ion-header no-border >
    <ion-toolbar mode="md|ios">
      <ion-title class="text-color" >{{'COMMON.CHAT_TITLE' | translate}}</ion-title>
      <ion-back-button defaultHref="/home" class="text-color" fill="clear" size="small" slot="start"  [text]="''"></ion-back-button>
    </ion-toolbar>
   </ion-header>

  <ion-content [fullscreen]="true" >
    <div class="container components-color">

      <!-- <ng-container *ngIf="(chatrooms$ | async) as chatrooms">
        <ng-container *ngIf="!(pending$ | async); else loader">
          <ng-container *ngIf="chatrooms?.length > 0; else noData">

            <ion-list>
              <ion-item *ngFor="let chatroom of chatrooms; trackBy: trackById">
                <ion-avatar slot="start">
                  <img [src]="chatroom?.value?.image">
                </ion-avatar>
                <ion-label>
                  <h2>{{chatroom?.value?.name}}</h2>
                </ion-label>
              </ion-item>
            </ion-list>


          </ng-container>
        </ng-container>
      </ng-container> -->


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
  </ion-content>
  `,
  styleUrls: ['./chat.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatPage {

  messages$: Observable<any> = this.route.params.pipe(
    // tap(({chatRoomKey}) => console.log(chatRoomKey)),
    filter(({chatRoomKey}) => !!chatRoomKey),
    tap(({chatRoomKey}) => this.store.dispatch(ChatroomActions.loadChatroom({key: chatRoomKey})) ),
    switchMap(() => this.store.pipe(select(fromChatroom.getChatroom)))
  );


  constructor(private store: Store, private route: ActivatedRoute) {
    this.messages$.subscribe(data => console.log(data))
  }



}
