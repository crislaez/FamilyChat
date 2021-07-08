import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
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
            console.log(error)
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
            console.log(error)
            return [ChatroomActions.saveChatrooms({chatrooms: []}) ]
          })
        )
      )
    )
  );

  loadChatroom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatroomActions.loadChatroom),
      switchMap(({key}) =>
        this._chatroom.getChatroomByKey(key).pipe(
          map((chatroom) => ChatroomActions.saveChatroom({chatroom: chatroom || {}}) ),
          catchError((error) => {
            console.log(error)
            return [ChatroomActions.saveChatroom({chatroom: {}}) ]
          })
        )
      )
    )
  );

  // loadReposInit$ = createEffect(() =>
  //   of(ChatroomActions.loadChatrooms())
  // );


  constructor(private _chatroom: ChatroomService, private actions$: Actions){}
}
