import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromAuth, User } from '@familyChat/shared/auth';
import { ChatroomActions, fromChatroom } from '@familyChat/shared/chatroom';
import { emptyObject, errorImage, trackById } from '@familyChat/shared/shared/utils/utils';
import { AlertController, IonButton } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap, startWith } from 'rxjs/operators';
import { now_date } from '@familyChat/shared/shared/utils/utils'
// import { Camera, CameraResultType } from '@capacitor/camera';
// import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';

@Component({
  selector: 'app-chat',
  template: `
  <ng-container *ngIf="(info$ | async) as info; else loading">
    <ng-container *ngIf="info; else error">
      <ng-container *ngIf="(userLoger$ | async) as userLoger">

        <ion-header no-border >
          <ion-toolbar>
            <ion-back-button defaultHref="/home" class="text-color" fill="clear" size="small" slot="start" [text]="''"></ion-back-button>

            <ion-chip class="ion-margin-start">
              <ion-avatar>
                <ng-container *ngIf="emptyObject(info?.image); else publicChatImage">
                  <img [src]="info?.image[getOtherUser(info?.image, userLoger?.$key)]" loading="lazy" (error)="errorImage($event)">
                </ng-container>

                <ng-template #publicChatImage>
                  <img [src]="info?.image" loading="lazy" (error)="errorImage($event)">
                </ng-template>
              </ion-avatar>

              <ng-container *ngIf="emptyObject(info?.name); else publicChatName">
                <ion-label class="text-color" >{{info?.name[getOtherUser(info?.name, userLoger?.$key)]}}</ion-label>
              </ng-container>
              <ng-template  #publicChatName>
                <ion-label class="text-color" >{{info?.name}}</ion-label>
              </ng-template>
            </ion-chip>

          </ion-toolbar>
        </ion-header>


        <ion-content [fullscreen]="true" #content>
          <div class="container components-color-second">

            <ng-container *ngIf="!(pending$ | async); else loader">
              <ng-container *ngIf="(statusChatroom$ | async) === 'success'; else serverError">
                <ng-container *ngIf="emptyObject(info?.messages); else noData">
                  <ion-card class="card-arrow fade-in-card" *ngFor="let message of getObjectKeys(info?.messages); trackBy: trackById" [ngClass]="{'right card-arrow-rigth': userLoger?.ui === info?.messages[message]?.ui, 'card-arrow-left':userLoger?.ui !== info?.messages[message]?.ui}" >
                    <ion-card-content >
                      <div class="displays-start width-max">
                        <ion-avatar>
                          <img [src]="info?.messages[message]?.avatar" loading="lazy" (error)="errorImage($event, true)">
                        </ion-avatar>

                        <div class="displays-center margin-left-5">{{info?.messages[message]?.name}}:</div>
                        <ion-button *ngIf="userLoger?.ui === info?.messages[message]?.ui" fill="clear" class="text-color delete-button displays-center" (click)="deleteMessage(message)"><ion-icon class="font-big" name="close-outline"></ion-icon></ion-button>
                      </div>

                      <ng-container *ngIf="checkIsPhoto(info?.messages[message]?.message); else divPhoto">
                        <div class="margin-top">{{info?.messages[message]?.message}}</div>
                      </ng-container>
                      <ng-template #divPhoto>
                        <img class="chat-phot" [src]="info?.messages[message]?.message" loading="lazy" />
                      </ng-template>

                      <div class="margin-top font-small text-color-third">{{getTimeStamp(info?.messages[message]?.create_at) | date: 'MMMM d, h:mm a'}}</div>
                    </ion-card-content>
                  </ion-card>
                </ng-container>
              </ng-container>
            </ng-container>

            <ng-template #noData>
              <div class="error-serve">
                <div>
                  <span class="text-color">{{'COMMON.NOT_MESSAGES' | translate}}</span>
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


            <ng-template #loader>
              <ion-spinner class="loadingspinner"></ion-spinner>
            </ng-template>

          </div>
        </ion-content>

        <ion-footer >
          <ion-toolbar class="components-color-second">
            <div class="footer-toolbar">
              <form [formGroup]="messageForm" (submit)="messageSubmit($event, userLoger)">
                <ion-item >
                  <ion-textarea class="text-color" [placeholder]="'COMMON.MESSAGE' | translate" formControlName="message" ></ion-textarea>
                </ion-item>

                <ion-button fill="clear" type="submit"><ion-icon class="text-color-four" name="send-outline"></ion-icon></ion-button>
              </form>

              <div>
                <ion-button (click)="takePicture()" class="border-around"> <ion-icon class="text-color" name="camera-outline"></ion-icon></ion-button>
                <ion-input id="inputPhoto" #inputPhoto class="hide" type="file" (change)="getPhoto($event, userLoger)" ></ion-input>
              </div>

              <div>
                <ion-button class="border-around"> <ion-icon class="text-color" name="mic-outline"></ion-icon></ion-button>
              </div>
            </div>
          </ion-toolbar>
        </ion-footer>

      </ng-container>
    </ng-container>
  </ng-container>



  <ng-template #error>
    <ion-header no-border >
      <ion-toolbar mode="md|ios">
        <ion-title class="text-color" >{{'COMMON.CHAT_TITLE' | translate}}</ion-title>
        <ion-back-button defaultHref="/home" class="text-color" fill="clear" size="small" slot="start" [text]="''"></ion-back-button>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" >
      <div class="container components-color-third">
        <div class="error-serve">
          <div>
            <span class="text-color">{{'COMMON.NORESULT' | translate}}</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ng-template>


  <ng-template #loading>
    <ion-content >
      <div class="container components-color-third">
        <ion-spinner class="loadingspinner"></ion-spinner>
      </div>
    </ion-content>
  </ng-template>
  `,
  styleUrls: ['./chat.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatPage implements OnInit, OnDestroy{

  @ViewChild('content') private content: any;
  // @ViewChild('inputPhoto', {static: true }) private inputPhoto: ElementRef;
  @ViewChild("inputPhoto") inputPhoto: ElementRef;

  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;

  image = new FormControl('', [Validators.required])

  private ngUnsubscribe$ = new Subject<void>();
  pendingStatus$: Observable<boolean> = this.store.pipe(select(fromChatroom.getPendingStatus));
  pending$: Observable<boolean> = this.store.pipe(select(fromChatroom.getPending));
  statusChatroom$: Observable<string> = this.store.pipe(select(fromChatroom.getStatusChatroom),
    tap(status => {
      if(status === 'error') this.router.navigate(['/home'])
    })
  );
  userLoger$: Observable<any> = this.store.pipe(select(fromAuth.getUser));

  info$: Observable<any> = this.route.params.pipe(
    filter(({chatRoomKey}) => !!chatRoomKey),
    tap(({chatRoomKey}) => this.store.dispatch(ChatroomActions.loadChatroom({key: chatRoomKey}))),
    switchMap(() => {
      return this.store.pipe(select(fromChatroom.getChatroom))
    }),
    tap(() => this.scrollToBottomOnInit())
  );

  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl(''),
    ui: new FormControl(''),
    create_at: new FormControl(''),
    avatar: new FormControl(''),
  });


  constructor(private store: Store,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private translate: TranslateService,
    private router: Router) {
    // this.statusChatroom$.subscribe(data => console.log(data))
  }


  ngOnInit(): void{
    this.pendingStatus$.pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(val => {
      if (this.messageForm) {
        this.messageForm[val ? 'disable' : 'enable']();
      }
    })

    setTimeout(() => this.content?.scrollToBottom(0), 1000)
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  // SUBMIT MESSAGE
  messageSubmit(event: Event, userLoger: User): void{
    event.preventDefault();

    const newDate = new Date();
    const create_at = newDate.getTime();

    this.messageForm.controls.ui.setValue(userLoger?.ui);
    this.messageForm.controls.name.setValue(userLoger?.name);
    this.messageForm.controls.create_at.setValue(create_at);
    this.messageForm.controls.avatar.setValue(userLoger?.avatar);
    // this.messageForm.controls.avatar.setValue('');

    let key = this.route.snapshot?.params?.chatRoomKey

    if(!!this.messageForm.value?.message){
      this.store.dispatch(ChatroomActions.saveMessage({message:this.messageForm.value, key}))
      this.messageForm.reset();
    }
  }

  // CHAT OBJECTS KEY
  getObjectKeys(object): any{
    return Object.keys(object || {})
  }

  //SCROLL TO BOTTOM
  scrollToBottomOnInit() {
    setTimeout(() => this.content?.scrollToBottom(0), 0)
  }

  getTimeStamp(timestamp:number): any{
    return new Date(timestamp) || ''
  }

  async deleteMessage(messageKey: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.translate.instant('COMMON.ALERT'),
      message: this.translate.instant('COMMON.ALERT_DELETE_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('COMMON.NO'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant('COMMON.YES'),
          handler: () => {
            let chatroomKey = this.route.snapshot?.params?.chatRoomKey
            this.store.dispatch(ChatroomActions.deleteMessage({messageKey, key:chatroomKey}))
          }
        }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

  getOtherUser(chatroom, loginUser): any{
    return (Object.keys(chatroom || {}) || []).filter(item => item !== loginUser) || '';
  }

  getPhoto(event, userLoger: User): void{
    const photo = event.target.files[0]
    let key = this.route.snapshot?.params?.chatRoomKey
    if(!!photo){

    const newDate = new Date();
    const create_at = newDate.getTime();
      const message = {
        ui:userLoger?.ui,
        name:userLoger?.name,
        create_at:create_at,
        avatar:userLoger?.avatar,
        message:photo
      }
      this.store.dispatch(ChatroomActions.savePhotoMessage({message, key}))
    }
  }

  takePicture(): void{
    let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

  checkIsPhoto(message): boolean{
    if(message) return !!message.startsWith('https://') ? false : true
    return true
  }

  getSound(): void{

  }

//  async takePicture (event) {
//     const image = await Camera.getPhoto({
//       quality: 90,
//       allowEditing: true,
//       resultType: CameraResultType.Uri
//     });

//     console.log(image)
//     // let key = this.route.snapshot?.params?.chatRoomKey
//     // if(!!image.webPath)  this.store.dispatch(ChatroomActions.savePhotoMessage({photo:image, key}))


//     var imageUrl = image.webPath;

//     // Can be set to the src of an image now
//     // imageElement.src = imageUrl;
//   };



}
