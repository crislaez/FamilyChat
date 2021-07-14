import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';


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
      exhaustMap(({ email, password }) =>
        this._auth.login(email, password).pipe(
          map((user) => {
            if(user?.type === 'value') return AuthActions.loginSuccess({ user })
            return AuthActions.updateUser({ user })
          }),
          catchError((error) => {
            console.log(error)
            return [AuthActions.loginFailure({ error: 'COMMON.LOGIN_INVALID_CREDENTIALST' })]
          })
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password, name }) =>
        this._auth.register(email, password, name).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error) =>{
            return [AuthActions.registerFailure({ error: 'COMMON.REGISTER_FAILURE_USER_EXIST' })]
          })
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
          tap(res => {
            this.router.navigate(['/login'])
          }),
          catchError((error) =>{
            return of([])
          })
        )
      )
    ), { dispatch: false }
  );

  messageFailureAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure, AuthActions.registerFailure),
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
    public toastController: ToastController
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
