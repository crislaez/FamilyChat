import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fromAuth } from '@familyChat/shared/auth';
import { errorImage } from '@familyChat/shared/shared/utils/utils';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-setting',
  template: `
    <ng-container *ngIf="(userLoger$ | async) as userLoger">
      <ion-header no-border >
        <ion-toolbar mode="md|ios">

          <ion-back-button defaultHref="/home" class="text-color" fill="clear" size="small" slot="start" [text]="''"></ion-back-button>

          <ion-title class="text-color" >{{'COMMON.SETTINGS' | translate}}</ion-title>

        </ion-toolbar>
      </ion-header>


      <ion-content [fullscreen]="true" >
        <div class="container components-color-second">

          <ion-list>
            <ion-list-header>
              <ion-chip class="ion-margin-start">
                <ion-avatar>
                  <img [src]="userLoger?.avatar" loading="lazy" (error)="errorImage($event)">
                </ion-avatar>
                <ion-label class="text-color" >{{userLoger?.name}}</ion-label>
              </ion-chip>
            </ion-list-header>

            <ion-item class="ion-activatable ripple-parent text-color">
              <ion-label>{{'COMMON.PERFIL_EDIT' | translate}}</ion-label>
              <!-- <ion-badge slot="end">22k</ion-badge> -->
              <ion-ripple-effect type="unbounded"></ion-ripple-effect>
            </ion-item>
          </ion-list>

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
export class SettingPage {

  errorImage = errorImage;
  userLoger$: Observable<any> = this.store.pipe(select(fromAuth.getUser));


  constructor(private store: Store) { }



}
