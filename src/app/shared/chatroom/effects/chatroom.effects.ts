import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AuthActions, fromAuth } from '../../auth';
import { ChatroomActions } from '../actions';
import { ChatroomService } from '../services/chatroom.service';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';


@Injectable()
export class ChatroomEffects {


  loadChatrooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.loadChatrooms, AuthActions.updateUser),
      withLatestFrom(
        this.store.pipe(select(fromAuth.getUser))
      ),
      switchMap(([{user}]) =>
        this._chatroom.getChatrooms((user as any)?.chats).pipe(
          map((chatrooms) => ChatroomActions.saveChatrooms({chatrooms: chatrooms || [], statusChatrooms:'success'}) ),
          catchError((error) => {
            return [ChatroomActions.saveChatrooms({chatrooms: [], statusChatrooms:'error'}) ]
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
          map((chatrooms) => ChatroomActions.saveChatrooms({chatrooms: chatrooms || [], statusChatrooms:'success'}) ),
          catchError((error) => {
            return [ChatroomActions.saveChatrooms({chatrooms: [], statusChatrooms:'error'}) ]
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
          map((chatroom) => ChatroomActions.saveChatroom({chatroom: chatroom || {}, statusChatroom:'success'}) ),
          catchError((error) => {
            return [ChatroomActions.saveChatroom({chatroom: {}, statusChatroom:'error'}) ]
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
          map(() => ChatroomActions.deleteMessageSuccess({key, message:'COMMON.DELETE_MESSAGE_SUCCESS'}) ),
          catchError((error) => {
            // console.log(error)
            return [ChatroomActions.deleteMessageFailure({error: 'COMMON.MESSAGE_DELETE_ERROR'}) ]
          })
        )
      )
    )
  );

  createChatroom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.createChatroom),
      withLatestFrom(
        this.store.pipe(select(fromAuth.getUser))
      ),
      switchMap(([{user}, userLogin]) =>
        this._chatroom.createChatroom(user, userLogin).pipe(
          map((chatkey) => ChatroomActions.createChatroomSuccess({chatkey:chatkey}) ),
          catchError((error) => {
            // console.log(error)
            return [ChatroomActions.createChatroomFailure({error: 'COMMON.CREATE_CHAT_ERROR'}) ]
          })
        )
      )
    )
  );

  createChatroomSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.createChatroomSuccess),
      tap(({chatkey}) => {
        this.dismiss();
        this.router.navigate(['/chat/'+chatkey])
      }),
    ), { dispatch: false }
  );

  messageFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.saveMessageFailure, ChatroomActions.deleteMessageFailure, ChatroomActions.createChatroomFailure),
      tap(({error}) => this.presentToast(this.translate.instant(error), 'danger')),
    ), { dispatch: false }
  );

  messageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.deleteMessageSuccess),
      tap(({message}) => this.presentToast(this.translate.instant(message), 'success')),
    ), { dispatch: false }
  );


  private dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  constructor(
    private store: Store,
    private router: Router,
    private _chatroom: ChatroomService,
    private actions$: Actions,
    private translate: TranslateService,
    public toastController: ToastController,
    private modalController: ModalController
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
