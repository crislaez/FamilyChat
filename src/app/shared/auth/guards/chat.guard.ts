import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, take, withLatestFrom } from 'rxjs/operators';
import * as fromAuth from './../reducers';

@Injectable({
  providedIn: 'root'
})
export class ChatGuard implements CanActivate {

  constructor(private router: Router, private store: Store) { }

  canActivate(_routerParams: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {

    const {params:{chatRoomKey}}  = _routerParams
    return this.store.pipe(
      select(fromAuth.isLoginPending),
      first(pending => !pending),
      withLatestFrom(
        this.store.pipe(select(fromAuth.getUser))
      ),
      map(([, userLoger]) =>{
        if(Object.values(userLoger?.chats || []).includes(chatRoomKey)) return true
        return this.router.parseUrl('/home')
      }),
      take(1)
    );
  }

}
