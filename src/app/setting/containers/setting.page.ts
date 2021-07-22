import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fromAuth, AuthActions } from '@familyChat/shared/auth';
import { errorImage } from '@familyChat/shared/shared/utils/utils';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-setting',
  template: `
    <ng-container *ngIf="(userLoger$ | async) as userLoger">
      <ion-header no-border >
        <ion-toolbar>

          <ion-back-button defaultHref="/home" class="text-color" fill="clear" size="small" slot="start" [text]="''"></ion-back-button>

          <ion-title class="text-color" >{{'COMMON.PROFILE' | translate}}</ion-title>

        </ion-toolbar>
      </ion-header>


      <ion-content [fullscreen]="true" >
        <div class="container components-color-second">

        <div class="div-edit-image">
          <img [src]="userLoger?.avatar" (error)="errorImage($event)">
        </div>

        <form [formGroup]="updateForm" (submit)="registerSubmit($event)">

          <ion-item >
            <ion-label class="text-color ion-text-wrap" position="floating">{{'COMMON.NAME_LABEL' | translate}}</ion-label>
            <ion-input class="text-color"  formControlName="name" ></ion-input>
          </ion-item>
          <!-- <div class="div-error" *ngIf="showErrors && updateForm?.controls['email']?.errors?.required">{{'FORMS.EMPTY_EMAIL' | translate}}</div>
          <div class="div-error" *ngIf="showErrors && updateForm?.controls['email']?.status === 'INVALID'">{{'FORMS.ERROR_EMAIL' | translate}}</div> -->

          <ion-item >
          <!-- <ion-input type="file" accept="image/*" (change)="changeListener($event)"></ion-input> -->
            <ion-label class="text-color ion-text-wrap" position="floating">{{'COMMON.AVATAR' | translate}}</ion-label>
            <ion-input class="text-color" type="file" [placeholder]="'COMMON.PASSWORD' | translate" formControlName="avatar" (change)="getAvatarFile($event)" ></ion-input>
          </ion-item>
          <!-- <div class="div-error" *ngIf="showErrors && updateForm?.controls['password']?.errors?.required">{{'FORMS.EMPTY_PASSWORD' | translate}}</div>
          <div class="div-error" *ngIf="showErrors && (updateForm?.controls['password']?.status === 'INVALID')">{{'FORMS.ERROR_PASSWORD_LENGTH' | translate}}</div> -->

          <ion-button class="ion-button-background" type="submit">{{'COMMON.EDIT' | translate}}</ion-button>

        </form>

          <!-- IS NO DATA  -->
          <ng-template #noData>
            <div class="error-serve">
              <div>
                <span class="text-color">{{'COMMON.NO_CONTACT' | translate}}</span>
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

          <!-- LOADER  -->
          <ng-template #loader>
            <ion-spinner class="loadingspinner"></ion-spinner>
          </ng-template>
        </div>
      </ion-content>

    </ng-container>
  `,
  styleUrls: ['./setting.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingPage implements OnInit {

  errorImage = errorImage;
  showErrors: boolean = false;

  userLoger$: Observable<any> = this.store.pipe(select(fromAuth.getUser));
  pending$: Observable<boolean> = this.store.pipe(select(fromAuth.getLoginStatusPending))
  private ngUnsubscribe$ = new Subject<void>();

  updateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    avatar: new FormControl(''),
  });


  constructor(private store: Store) {
    // this.pending$.subscribe(data => console.log(data))
  }


  ngOnInit(): void{
    this.pending$.pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(val => {
      if (this.updateForm) {
        this.updateForm[val ? 'disable' : 'enable']();
      }
    })

    this.userLoger$.pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(val => {
      this.updateForm.patchValue({name:val.name,})
    })
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  registerSubmit(event: Event): void{
    event.preventDefault();
    this.showErrors = true;

    if(!this.updateForm.invalid){
      this.store.dispatch(AuthActions.update({name: this.updateForm.controls.name.value, avatar: this.updateForm.controls.avatar.value}))
    }
  }

  getAvatarFile(event): void{
    this.updateForm.controls.avatar.setValue(event.target.files[0])
  }

}
