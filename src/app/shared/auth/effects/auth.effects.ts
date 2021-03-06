import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';
import { select, Store } from '@ngrx/store';
import * as fromAuth from '../reducers'

@Injectable()
export class AuthEffects {

  autologin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autologin),
      exhaustMap(() =>
        this._auth.autologin().pipe(
          map((user) => {
            if(user?.type === 'value') return AuthActions.autologinSuccess({ user })
            return AuthActions.updateUser({ user })
          }),
          catchError(error => [AuthActions.autologinFailure({ error })])
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this._auth.login(email, password).pipe(
          map((user) => {
            if(user?.type === 'value') return AuthActions.loginSuccess({ user })
            return AuthActions.updateUser({ user })
          }),
          catchError((error) => {
            // console.log(error)
            return [AuthActions.loginFailure({ error: 'COMMON.LOGIN_INVALID_CREDENTIALST' })]
          })
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ email, password, name }) =>
        this._auth.register(email, password, name).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error) =>{
            return [AuthActions.registerFailure({ error: 'COMMON.REGISTER_FAILURE_USER_EXIST' })]
          })
        )
      )
    )
  );

  unsubscribe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.unsubscribe),
      switchMap(({user}) =>
        this._auth.unsubscribe(user).pipe(
          map(() => AuthActions.forceLogout()),
          catchError(error => [AuthActions.unsubscribeFailure({ error: 'COMMON.UNSUBSCRIBE_FAILURE_MESSAGE' })])
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.update),
      withLatestFrom(
        this.store.pipe(select(fromAuth.getUser))
      ),
      switchMap(([ {name, avatar}, {$key} ]) =>
        this._auth.update($key, name, avatar).pipe(
          map(() => AuthActions.updateSuccess({message:'COMMON.UPDATE_USER_SUCCESS'})),
          catchError(error => [AuthActions.updateFailure({ error: 'COMMON.UPDATE_USER_FAILURE' })])
        )
      )
    )
  );

  loginSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        this.presentToast(this.translate.instant('COMMON.LOGIN_SUCCESS'), 'success')
      }),
      tap(() => {
        this.router.navigate(['/home'])
      }),
    ), { dispatch: false }
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => this.presentToast(this.translate.instant('COMMON.REGISTER_SUCCESS'), 'success')),
      tap(() => {
        this.router.navigate(['/login'])
      }),
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout, AuthActions.forceLogout),
      switchMap(() =>
        this._auth.logout().pipe(
          tap(res =>  this.router.navigate(['/login'])),
          catchError((error) =>{
            return of([])
          })
        )
      )
    ), { dispatch: false }
  );

  messageSuccessAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateSuccess),
      tap(({message}) => this.presentToast(this.translate.instant(message), 'success')),
    ), { dispatch: false }
);

  messageFailureAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure, AuthActions.registerFailure, AuthActions.unsubscribeFailure, AuthActions.updateFailure),
      tap(({error}) => this.presentToast(this.translate.instant(error), 'danger')),
    ), { dispatch: false }
  );

  tyAutologin$ = createEffect(() =>
    of(AuthActions.autologin())
  );



  constructor(
    private actions$: Actions,
    private router: Router,
    private _auth: AuthService,
    private translate: TranslateService,
    public toastController: ToastController,
    private store: Store
  ) { }


  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 1000
    });
    toast.present();
  }

  // zaira@gmail.com
  // test@gmail.com
}
