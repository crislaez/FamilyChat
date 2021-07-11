import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AuthActions, fromAuth } from '../../auth';
import { ChatroomActions } from '../actions';
import { ChatroomService } from '../services/chatroom.service';
import { select, Store } from '@ngrx/store';

@Injectable()
export class ChatroomEffects {


  loadChatrooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.loadChatrooms),
      withLatestFrom(
        this.store.pipe(select(fromAuth.getUser))
      ),
      switchMap(([user]) =>
        this._chatroom.getChatrooms((user as any)?.chats).pipe(
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
      withLatestFrom(
        this.store.pipe(select(fromAuth.getUser))
      ),
      switchMap(([{user}]) =>
        this._chatroom.getChatrooms((user as any)?.chats).pipe(
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
      ofType(ChatroomActions.loadChatroom, ChatroomActions.saveMessageSuccess, ChatroomActions.deleteMessageSuccess),
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

  deleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.deleteMessage),
      switchMap(({messageKey, key}) =>
        this._chatroom.deleteMessageByChatroom(messageKey, key).pipe(
          map(() => ChatroomActions.deleteMessageSuccess({key}) ),
          catchError((error) => {
            // console.log(error)
            return [ChatroomActions.deleteMessageFailure({error: 'COMMON.MESSAGE_DELETE_ERROR'}) ]
          })
        )
      )
    )
  );

  messageFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.saveMessageFailure, ChatroomActions.deleteMessageFailure),
      tap(({error}) => this.presentToast(this.translate.instant(error), 'danger')),
    ), { dispatch: false }
  );

  messageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.deleteMessageSuccess),
      tap(() => this.presentToast(this.translate.instant('COMMON.DELETE_MESSAGE_SUCCESS'), 'success')),
    ), { dispatch: false }
  );


  constructor(
    private store: Store,
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
