import { Component, ChangeDetectionStrategy, ViewChild, EventEmitter } from '@angular/core';
import { gotToTop, trackById, errorImage, emptyObject } from '@familyChat/shared/shared/utils/utils';
import { AlertController, IonContent, IonInfiniteScroll } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { AuthActions } from '@familyChat/shared/auth';
import { select, Store } from '@ngrx/store';
import { Chatroom, fromChatroom, ChatroomActions } from '@familyChat/shared/chatroom';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { SearchPage } from './search.page';
import { fromAuth } from '@familyChat/shared/auth';
import { startWith, switchMap, map } from 'rxjs/operators';
import { User } from './../../shared/user/models/index';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  template: `
  <ng-container *ngIf="(userLoger$ | async) as userLoger">

    <ion-header no-border >
      <ion-toolbar mode="md|ios">

        <ion-chip class="ion-margin-start">
          <ion-avatar>
            <img [src]="userLoger?.avatar" loading="lazy" (error)="errorImage($event)">
          </ion-avatar>
          <ion-label class="text-color" >{{userLoger?.name}}</ion-label>
        </ion-chip>
        <!-- <ion-title class="text-color" >{{'COMMON.TITLE' | translate}}</ion-title> -->

        <ion-button fill="clear" size="small" slot="end" (click)="presentModal()">
          <ion-icon class="text-color" name="search-outline"></ion-icon>
        </ion-button>

        <ion-button fill="clear" size="small" slot="end" (click)="presentActionSheet(userLoger)">
          <ion-icon class="text-color" name="ellipsis-vertical-outline"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>


    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="container components-color-second">

        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="!(pending$ | async); else loader">
            <ng-container *ngIf="(statusChatrooms$ | async) === 'success'; else serverError">
              <ng-container *ngIf="info?.chatrooms?.length > 0; else noData">

                  <ion-list>
                    <ion-item class="text-color" *ngFor="let chatroom of info?.chatrooms; trackBy: trackById" [routerLink]="['/chat/'+chatroom?.$key]">
                      <ion-avatar slot="start">
                        <ng-container *ngIf="emptyObject(chatroom?.value?.image); else publicChatImage">
                          <img [src]="chatroom?.value?.image[getOtherUser(chatroom?.value?.image, userLoger?.$key)]" loading="lazy" (error)="errorImage($event)">
                        </ng-container>

                        <ng-template #publicChatImage>
                          <img [src]="chatroom?.value?.image" loading="lazy" (error)="errorImage($event)">
                        </ng-template>
                      </ion-avatar>

                      <ion-label>
                        <ng-container *ngIf="emptyObject(chatroom?.value?.name); else publicChatName">
                          <h2>{{chatroom?.value?.name[getOtherUser(chatroom?.value?.name, userLoger?.$key)]}}</h2>
                        </ng-container>

                        <ng-template #publicChatName>
                          <h2>{{chatroom?.value?.name}}</h2>
                        </ng-template>
                      </ion-label>
                    </ion-item>
                  </ion-list>

                <!-- INFINITE SCROLL  -->
                <ng-container *ngIf="info?.total > 15">
                  <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, info?.total)">
                    <ion-infinite-scroll-content color="primary" class="loadingspinner">
                    </ion-infinite-scroll-content>
                  </ion-infinite-scroll>
                </ng-container>

              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>


        <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event, userLoger)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <div class="error-serve">
            <div>
              <span class="text-color">{{'COMMON.NO_CONTACT' | translate}}</span>
            </div>
          </div>
        </ng-template>

        <!-- IS ERROR -->
        <ng-template #serverError>
          <div class="error-serve">
            <div>
              <span><ion-icon class="text-color big-size" name="cloud-offline-outline"></ion-icon></span>
              <br>
              <span class="text-color">{{'COMMON.ERROR' | translate}}</span>
            </div>
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

  </ng-container>
  `,
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  showButton: boolean = false;
  perPage: number = 15;

  infiniteScroll$ = new EventEmitter();
  userLoger$: Observable<any> = this.store.pipe(select(fromAuth.getUser));
  pending$: Observable<boolean> = this.store.pipe(select(fromChatroom.getPending));
  statusChatrooms$: Observable<string> = this.store.pipe(select(fromChatroom.getStatusChatrooms));

  info$: Observable<{chatrooms:Chatroom[], total:number}> = this.infiniteScroll$.pipe(
    startWith(15),
    switchMap((perpage) =>
      this.store.pipe(select(fromChatroom.getChatrooms),
        map(chatrooms => {
          return {
            chatrooms: (chatrooms || []).slice(0, perpage),
            total: chatrooms?.length
          }
        })
      )
    )
  );


  constructor(
    public actionSheetController: ActionSheetController,
    private store: Store,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private translate: TranslateService) {
    // this.userLoger$.subscribe(data => console.log(data))
  }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 1000) this.showButton = true
    else this.showButton = false
  }

  // REFRESH
  doRefresh(event, user) {
    setTimeout(() => {
      this.store.dispatch(ChatroomActions.loadChatrooms({user}));
      this.clearAll();

      event.target.complete();
    }, 1000);
  }

  // INIFINITE SCROLL
  loadData(event, total) {
    setTimeout(() => {
      this.perPage = this.perPage + 15;
      if(this.perPage >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }
      this.infiniteScroll$.next(this.perPage)

      event.target.complete();
    }, 1000);
  }


  //CLEAR
  clearAll(): void{
    this.perPage = 15
    this.infiniteScroll$.next(this.perPage)
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false
  }

  getOtherUser(chatroom, loginUser): any{
    return (Object.keys(chatroom || {}) || []).filter(item => item !== loginUser) || '';
  }

  // MODALES *********************************************************************

  //MODAL AJUSTES
  async presentActionSheet(user?:User) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: this.translate.instant('COMMON.PERFIL_EDIT'),
          role: 'destructive',
          icon: 'person',
          handler: () => {
            this.router.navigate(['/setting'])
          }
        },
        {
          text: this.translate.instant('COMMON.LOGOUT'),
          role: 'destructive',
          icon: 'log-out',
          handler: () => {
            this.store.dispatch(AuthActions.logout())
          }
        },
        {
          text: this.translate.instant('COMMON.UNSUBSCRIBE'),
          role: 'destructive',
          icon: 'exit-outline',
          handler: () => {
            this.presentAlert(user);
          }
        },
        {
          text: this.translate.instant('COMMON.CANCEL'),
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
  }

  // MODAL PARA BUSCAR USUARIOS
  async presentModal() {
    const modal = await this.modalController.create({
      component: SearchPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  // MODAL DE CONFIRMACION DARSE DE BAJA
  async presentAlert(user?:User) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.translate.instant('COMMON.ALERT'),
      message: this.translate.instant('COMMON.UNSUBSCRIBE_CONFIRM_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('COMMON.NO'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant('COMMON.YES'),
          cssClass: 'secondary',
          handler: () => {
            this.store.dispatch(AuthActions.unsubscribe({user}))
          }
        }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }



}



