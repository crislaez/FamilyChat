import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthActions } from '../../auth';
import { ChatroomActions } from '../actions';
import { ChatroomService } from '../services/chatroom.service';

@Injectable()
export class ChatroomEffects {


  loadChatrooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.loadChatrooms),
      switchMap(() =>
        this._chatroom.getChatrooms().pipe(
          map((chatrooms) => ChatroomActions.saveChatrooms({chatrooms: chatrooms || []}) ),
          catchError((error) => {
            // console.log(error)
            return [ChatroomActions.saveChatrooms({chatrooms: []}) ]
          })
        )
      )
    )
  );

  loadChatroomsLoginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.autologinSuccess),
      switchMap(() =>
        this._chatroom.getChatrooms().pipe(
          map((chatrooms) => ChatroomActions.saveChatrooms({chatrooms: chatrooms || []}) ),
          catchError((error) => {
            // console.log(error)
            return [ChatroomActions.saveChatrooms({chatrooms: []}) ]
          })
        )
      )
    )
  );

  loadChatroom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.loadChatroom, ChatroomActions.saveMessageSuccess),
      switchMap(({key}) =>
        this._chatroom.getChatroomByKey(key).pipe(
          map((chatroom) => ChatroomActions.saveChatroom({chatroom: chatroom || {}}) ),
          catchError((error) => {
            // console.log(error)
            return [ChatroomActions.saveChatroom({chatroom: {}}) ]
          })
        )
      )
    )
  );

  saveMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.saveMessage),
      switchMap(({message, key}) =>
        this._chatroom.saveMessageByChatroom(message, key).pipe(
          map(() => ChatroomActions.saveMessageSuccess({key}) ),
          catchError((error) => {
            // console.log(error)
            return [ChatroomActions.saveMessageFailure({error: 'COMMON.MESSAGE_SEND_ERROR'}) ]
          })
        )
      )
    )
  );

  messageFailureAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.saveMessageFailure),
      tap(({error}) => this.presentToast(this.translate.instant(error), 'danger')),
    ), { dispatch: false }
  );


  constructor(
    private _chatroom: ChatroomService,
    private actions$: Actions,
    private translate: TranslateService,
    public toastController: ToastController
  ){}


  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 1000
    });
    toast.present();
  }
}
