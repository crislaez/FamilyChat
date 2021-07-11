import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthActions, fromAuth } from '@familyChat/shared/auth';
import { errorImage } from '@familyChat/shared/shared/utils/utils';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  template: `
  <ion-content >
    <div class="container-login components-color">

      <div>
        <img [src]="loginImage" (error)="errorImage($event)">
      </div>

      <form [formGroup]="loginForm" (submit)="registerSubmit($event)">

        <ion-item >
          <ion-input [placeholder]="'COMMON.EMAIL' | translate" formControlName="email" ></ion-input>
        </ion-item>
        <div class="div-error" *ngIf="showErrors && loginForm?.controls['email']?.errors?.required">{{'FORMS.EMPTY_EMAIL' | translate}}</div>
        <div class="div-error" *ngIf="showErrors && loginForm?.controls['email']?.status === 'INVALID'">{{'FORMS.ERROR_EMAIL' | translate}}</div>

        <ion-item >
          <ion-input type="password" [placeholder]="'COMMON.PASSWORD' | translate" formControlName="password" ></ion-input>
        </ion-item>
        <div class="div-error" *ngIf="showErrors && loginForm?.controls['password']?.errors?.required">{{'FORMS.EMPTY_PASSWORD' | translate}}</div>
        <div class="div-error" *ngIf="showErrors && (loginForm?.controls['password']?.status === 'INVALID')">{{'FORMS.ERROR_PASSWORD_LENGTH' | translate}}</div>

        <ion-button  type="submit">{{'COMMON.LOGIN' | translate}}</ion-button>

      </form>

      <div class="margin-top-30">
        <a [routerLink]="['/register']">{{'COMMON.NOT_HAS_USER' | translate}}</a>
      </div>
    </div>

  </ion-content>
  `,
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit, OnDestroy {

  errorImage = errorImage;
  loginImage: string = '../../../assets/images/login.png';
  showErrors: boolean = false;

  private ngUnsubscribe$ = new Subject<void>();
  pending$: Observable<boolean> = this.store.pipe(select(fromAuth.getLoginStatusPending));

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });


  constructor(private store: Store) { }


  ngOnInit(): void{
    this.pending$.pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(val => {
      if (this.loginForm) {
        this.loginForm[val ? 'disable' : 'enable']();
      }
    })
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  registerSubmit(event: Event): void{
    event.preventDefault();
    this.showErrors = true;

    if(!this.loginForm.invalid){
      this.store.dispatch(AuthActions.login({email: this.loginForm.controls.email.value, password: this.loginForm.controls.password.value}))
    }
  }

}
