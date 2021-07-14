import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthActions } from '../../auth';
import { UserActions } from '../actions';
import { UserService } from '../services/user.service';


@Injectable()
export class UserEffects {


  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this._user.getusers().pipe(
          map((users) => UserActions.saveUsers({users: users || [], status:'success'}) ),
          catchError((error) => {
            // console.log(error)
            return [UserActions.saveUsers({users: [], status:'error'})]
          })
        )
      )
    )
  );

  loadUsersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.autologinSuccess),
      switchMap(() =>
        this._user.getusers().pipe(
          map((users) => UserActions.saveUsers({users: users || [], status:'success'}) ),
          catchError((error) => {
            // console.log(error)
            return [UserActions.saveUsers({users: [], status:'error'}) ]
          })
        )
      )
    )
  );

  // messageFailure$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.saveMessageFailure, UserActions.deleteMessageFailure),
  //     tap(({error}) => this.presentToast(this.translate.instant(error), 'danger')),
  //   ), { dispatch: false }
  // );

  // messageSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.deleteMessageSuccess),
  //     tap(() => this.presentToast(this.translate.instant('COMMON.DELETE_MESSAGE_SUCCESS'), 'success')),
  //   ), { dispatch: false }
  // );

  // ngrxOnInitEffects() {
  //   return HomeRecruitmentActions.checkClientSession();
  // }

  constructor(
    private store: Store,
    private _user: UserService,
    private actions$: Actions,
    private translate: TranslateService,
    public toastController: ToastController
  ){}


  // async presentToast(message, color) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     color: color,
  //     duration: 1000
  //   });
  //   toast.present();
  // }
}
