import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthActions, fromAuth } from '@familyChat/shared/auth';
import { errorImage } from '@familyChat/shared/shared/utils/utils';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container-register components-color">

      <div>
        <img [src]="loginImage" (error)="errorImage($event)">
      </div>

      <form [formGroup]="registerForm" (submit)="registerSubmit($event)">

        <ion-item >
          <ion-input [placeholder]="'COMMON.NAME' | translate" formControlName="name" ></ion-input>
        </ion-item>
        <div class="div-error" *ngIf="showErrors && registerForm?.controls['name']?.errors?.required">{{'FORMS.EMPTY_NAME' | translate}}</div>

        <ion-item >
          <ion-input [placeholder]="'COMMON.EMAIL' | translate" formControlName="email" ></ion-input>
        </ion-item>
        <div class="div-error" *ngIf="showErrors && registerForm?.controls['email']?.errors?.required">{{'FORMS.EMPTY_EMAIL' | translate}}</div>
        <div class="div-error" *ngIf="showErrors && registerForm?.controls['email']?.status === 'INVALID'">{{'FORMS.ERROR_EMAIL' | translate}}</div>

        <ion-item >
          <ion-input type="password" [placeholder]="'COMMON.PASSWORD' | translate" formControlName="password" ></ion-input>
        </ion-item>
        <div class="div-error" *ngIf="showErrors && registerForm?.controls['password']?.errors?.required">{{'FORMS.EMPTY_PASSWORD' | translate}}</div>
        <div class="div-error" *ngIf="showErrors && (registerForm?.controls['password'].value !== registerForm?.controls['checkPassword'].value)">{{'FORMS.ERROR_PASSWORDS' | translate}}</div>
        <div class="div-error" *ngIf="showErrors && (registerForm?.controls['password']?.status === 'INVALID')">{{'FORMS.ERROR_PASSWORD_LENGTH' | translate}}</div>

        <ion-item >
          <ion-input type="password" [placeholder]="'COMMON.REPEAT_PASSWORD' | translate" formControlName="checkPassword" ></ion-input>
        </ion-item>
        <div class="div-error" *ngIf="showErrors && registerForm?.controls['checkPassword']?.errors?.required">{{'FORMS.EMPTY_REPEAT_PASSWORD' | translate}}</div>
        <div class="div-error" *ngIf="showErrors && (registerForm?.controls['checkPassword'].value !== registerForm?.controls['password'].value)">{{'FORMS.ERROR_PASSWORDS' | translate}}</div>
        <div class="div-error" *ngIf="showErrors && (registerForm?.controls['checkPassword']?.status === 'INVALID')">{{'FORMS.ERROR_PASSWORD_LENGTH' | translate}}</div>

        <ion-button  type="submit">{{'COMMON.REGISTER' | translate}}</ion-button>

      </form>

      <div class="margin-top-30">
        <a [routerLink]="['/login']">{{'COMMON.HAS_USER' | translate}}</a>
      </div>

    </div>
  </ion-content>
  `,
  styleUrls: ['./register.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPage implements OnInit, OnDestroy {

  errorImage = errorImage;
  loginImage: string = '../../../assets/images/register.png';
  showErrors: boolean = false;

  private ngUnsubscribe$ = new Subject<void>();
  pending$: Observable<boolean> = this.store.pipe(select(fromAuth.getLoginStatusPending));

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    checkPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });


  constructor(private store: Store) { }


  ngOnInit(): void{
    this.pending$.pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(val => {
      if (this.registerForm) {
        this.registerForm[val ? 'disable' : 'enable']();
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

    if(!this.registerForm.invalid){
      if(this.registerForm.controls.password.value === this.registerForm.controls.checkPassword.value){
        this.store.dispatch(AuthActions.register({email: this.registerForm.controls.email.value, password: this.registerForm.controls.password.value, name: this.registerForm.controls.name.value}))
      }
    }
  }



}
