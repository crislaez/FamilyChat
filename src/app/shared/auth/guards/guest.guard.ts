import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, take, withLatestFrom } from 'rxjs/operators';
import * as fromAuth from './../reducers';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router, private store: Store) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.pipe(
      select(fromAuth.isLoginPending),
      first(pending => !pending),
      withLatestFrom(
        this.store.pipe(select(fromAuth.isLoggedIn))
      ),
      map(([pending, isLoggedIn]) =>{
        if(isLoggedIn) return this.router.parseUrl('/home')
        return true;
      }),
      take(1)
    );
  }

}
