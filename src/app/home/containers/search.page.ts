import { Component, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { gotToTop, trackById, errorImage } from '@familyChat/shared/shared/utils/utils';
import { Observable, combineLatest } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { fromUser, UserActions} from '@familyChat/shared/user';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-search.page',
  template:`
  <ion-header translucent>
    <ion-toolbar>
      <ion-title class="text-color">Modal Content</ion-title>
      <ion-buttons class="text-color" slot="end">
        <ion-button  (click)="dismiss()"><ion-icon fill="clear" class="text-color" name="close-outline"></ion-icon></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
    <div class="container">
      <div class="header" no-border>
        <form (submit)="searchSubmit($event)" class="fade-in-card">
          <ion-searchbar color="light" [placeholder]="'COMMON.SERACH_USER' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
        </form>
      </div>

      <ng-container *ngIf="(info$ | async) as info">
        <ng-container *ngIf="!(pending$ | async); else loader">
          <ng-container *ngIf="info?.users?.length > 0 ; else noData">         <!-- && (status$ | async) === 'success' -->

            <ion-card class="fade-in-card width-max" *ngFor="let user of info?.users; trackBy: trackById">
              <ion-card-header class="displays-around">
                <ion-avatar>
                  <img [src]="user?.avatar" (error)="errorImage($event, true)">
                </ion-avatar>
                <span class="text-color">{{user?.name}}</span>
              </ion-card-header>
            </ion-card>

            <!-- INFINITE SCROLL  -->
            <ng-container *ngIf="info?.total as total">
              <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                <ion-infinite-scroll-content color="primary" class="loadingspinner">
                </ion-infinite-scroll-content>
              </ion-infinite-scroll>
            </ng-container>

          </ng-container>
        </ng-container>
      </ng-container>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <div class="error-serve">
          <span class="text-second-color">{{'COMMON.NORESULT' | translate}}</span>
        </div>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <ion-spinner class="loadingspinner"></ion-spinner>
      </ng-template>

    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>

  </ion-content>
  `,
  styleUrls: ['./search.page.scss'],
})
export class SearchPage{

  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  showButton: boolean = false;
  search = new FormControl('');
  perPage: number = 15;

  searchValue$ = new EventEmitter();
  infiniteScroll$ = new EventEmitter();
  status$: Observable<string> = this.store.pipe(select(fromUser.getStatus));
  pending$: Observable<boolean> = this.store.pipe(select(fromUser.getPending));

  info$: Observable<any> = combineLatest([
    this.searchValue$.pipe(startWith('')),
    this.infiniteScroll$.pipe(startWith(20))
  ]).pipe(
    switchMap(([search, perpage]) =>
      this.store.pipe(select(fromUser.getUsers),
        map(users => {
          if(!!search){
            let result = (users || []).filter(user => user?.name.toUpperCase().includes(search.toUpperCase())).slice(0, perpage)
            return {
              users: result,
              total: result?.length
            }
          }
          return {
            users: (users || []).slice(0, perpage),
            total: users?.length
          }
        })
      )
    )
  );


  constructor(private store: Store, public platform: Platform, private modalController: ModalController) {
    this.info$.subscribe(data => console.log(data))
  }


  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.searchValue$.next(this.search.value);
    this.clearAll();
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.searchValue$.next('');
     this.clearAll();
  }

  // INIFINITE SCROLL
  loadData(event, total) {
    setTimeout(() => {
      this.perPage = this.perPage + 20;
      if(this.perPage >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }
      this.infiniteScroll$.next(this.perPage)
      event.target.complete();
    }, 500);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.store.dispatch(UserActions.loadUsers());
      this.searchValue$.next('');
      this.clearAll();

      event.target.complete();
    }, 500);
    }

  //CLEAR
  clearAll(): void{
    this.perPage = 20
    this.infiniteScroll$.next(this.perPage)
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
