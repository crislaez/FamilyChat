import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  template:`
  <ion-app >
   <!-- CABECERA  -->
   <!-- <ion-header no-border *ngIf="show$ | async">
     <ion-toolbar mode="md|ios">
       <ion-title class="text-color" >{{'COMMON.TITLE' | translate}}</ion-title>
     </ion-toolbar>
   </ion-header> -->

   <!-- MENU LATERAL  -->
   <!-- <ion-menu side="start" menuId="first" contentId="main">
     <ion-header>
       <ion-toolbar >
         <ion-title class="text-color" >Menu</ion-title>
       </ion-toolbar>
     </ion-header>

     <ion-content *ngIf="(menu$ | async) as menu">
       <ion-item class="text-color" *ngFor="let item of menu" [routerLink]="['/genre/'+item?.id]" (click)="deleteMovieByIdGenre()">{{item?.name}}</ion-item>
     </ion-content >
   </ion-menu> -->

   <!-- RUTER  -->
   <ion-router-outlet id="main"></ion-router-outlet>

   <!-- TAB FOOTER  -->
   <!-- <ion-tabs >
     <ion-tab-bar  [translucent]="true" slot="bottom">
       <ion-tab-button class="text-color" [routerLink]="['jobs']">
        <ion-icon name="bag-outline"></ion-icon>
       </ion-tab-button>

       <ion-tab-button class="text-color" [routerLink]="['trainings']">
        <ion-icon name="document-text-outline"></ion-icon>
       </ion-tab-button>

     </ion-tab-bar>
   </ion-tabs> -->

 </ion-app>
 `,
  styleUrls: ['./root.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {


  show$ = this.router.events.pipe(
    filter((event: RouterEvent) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects || event.url;
      const regex = new RegExp('^(/login|/recuperar-clave|/register|/404|/$)');
      return !regex.test(currentUrl);
    })
  );


  constructor(private menu: MenuController, private router: Router) {
    // this.menu$.subscribe(data => console.log(data))
  }


  open() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  redirectTo(passage: string): void{
    this.router.navigate(['/chapter/'+passage])
    this.menu.close('first')
  }

  openEnd() {
    this.menu.close();
  }

  deleteMovieByIdGenre(): void{
    // this.store.dispatch(MovieActions.deleteMovieGenre())
    this.openEnd();
  }


}
