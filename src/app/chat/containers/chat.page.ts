import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatroomActions, fromChatroom } from '@familyChat/shared/chatroom';
import { select, Store } from '@ngrx/store';
import { from, Observable, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { trackById, errorImage, emptyObject } from '@familyChat/shared/shared/utils/utils';
import { fromAuth, User } from '@familyChat/shared/auth';


@Component({
  selector: 'app-chat',
  template: `
  <ng-container *ngIf="(info$ | async) as info; else noData">

    <ion-header no-border >
      <ion-toolbar mode="md|ios" class="components-color-second">
        <ion-back-button defaultHref="/home" class="text-color" fill="clear" size="small" slot="start"  [text]="''"></ion-back-button>
        <ion-avatar >
          <img [src]="info?.image" (error)="errorImage($event)">
        </ion-avatar>
        <ion-title slot="end" class="text-color" >{{info?.name}}</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content [fullscreen]="true" >
      <div class="container components-color-second">

          <ng-container *ngIf="emptyObject(info?.messages); else noData">
            <ion-card  *ngFor="let message of getObjectKeys(info?.messages); trackBy: trackById">
              <!-- <ion-card-header>
                <ion-card-title >{{info?.messages[message]?.name}}</ion-card-title>
              </ion-card-header> -->

              <ion-card-content >
                <div class="mediun-size">{{info?.messages[message]?.name}}:</div>
                <div class="margin-top">{{info?.messages[message]?.message}}</div>
              </ion-card-content>

              <!-- <ion-ripple-effect></ion-ripple-effect> -->
            </ion-card>
          </ng-container>

        <!-- REFRESH -->
        <!-- <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher> -->

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <div class="error-serve">
            <span class="text-color">{{'COMMON.NORESULT' | translate}}</span>
          </div>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <ion-spinner class="loadingspinnerSecond"></ion-spinner>
        </ng-template>

      </div>
    </ion-content>

    <ion-footer >
      <ion-toolbar class="components-color-second">
        <ng-container *ngIf="(userLoger$ | async) as userLoger">
          <form [formGroup]="messageForm" (submit)="messageSubmit($event, userLoger)">
            <ion-item >
              <ion-input class="text-color" [placeholder]="'COMMON.EMAIL' | translate" formControlName="message" ></ion-input>
            </ion-item>

            <ion-button fill="clear" class="text-color" type="submit"><ion-icon name="send-outline"></ion-icon></ion-button>
          </form>
        </ng-container>
      </ion-toolbar>
    </ion-footer>
  </ng-container>



  <ng-template #noData>
    <ion-header no-border >
      <ion-toolbar mode="md|ios">
        <ion-title class="text-color" >{{'COMMON.CHAT_TITLE' | translate}}</ion-title>
        <ion-back-button defaultHref="/home" class="text-color" fill="clear" size="small" slot="start"  [text]="''"></ion-back-button>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" >
      <div class="container components-color-third">
        <div class="error-serve">
          <span class="text-color">{{'COMMON.NORESULT' | translate}}</span>
        </div>
      </div>
    </ion-content>
  </ng-template>
  `,
  styleUrls: ['./chat.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatPage implements OnInit, OnDestroy{

  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject
  private ngUnsubscribe$ = new Subject<void>();
  pendingStatus$: Observable<boolean> = this.store.pipe(select(fromChatroom.getPendingStatus));
  pending$: Observable<boolean> = this.store.pipe(select(fromChatroom.getPending));
  userLoger$: Observable<any> = this.store.pipe(select(fromAuth.getUser))

  info$: Observable<any> = this.route.params.pipe(
    filter(({chatRoomKey}) => !!chatRoomKey),
    tap(({chatRoomKey}) => this.store.dispatch(ChatroomActions.loadChatroom({key: chatRoomKey})) ),
    switchMap(() => this.store.pipe(select(fromChatroom.getChatroom)))
  );

  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl(''),
    ui: new FormControl(''),
    image: new FormControl(''),
    create_at: new FormControl(''),
    avatar: new FormControl(''),
  });


  constructor(private store: Store, private route: ActivatedRoute) {
    // this.info$.subscribe(data => console.log(data?.messages))
  }


  ngOnInit(): void{
    this.pendingStatus$.pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(val => {
      if (this.messageForm) {
        this.messageForm[val ? 'disable' : 'enable']();
      }
    })
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  messageSubmit(event: Event, userLoger: User): void{
    event.preventDefault();

    const newDate = new Date();
    const create_at = newDate.getTime();

    this.messageForm.controls.name.setValue(userLoger?.name);
    this.messageForm.controls.ui.setValue(userLoger?.ui);
    this.messageForm.controls.name.setValue(userLoger?.name);
    this.messageForm.controls.create_at.setValue(create_at);
    // this.messageForm.controls.avatar.setValue(userLoger?.avatar);
    this.messageForm.controls.avatar.setValue('');

    let key = this.route.snapshot?.params?.chatRoomKey

    this.store.dispatch(ChatroomActions.saveMessage({message:this.messageForm.value, key}))
    this.messageForm.reset()
  }

  getObjectKeys(object): any{
    return Object.keys(object || {})
  }


}
