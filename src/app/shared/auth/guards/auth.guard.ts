import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, take, withLatestFrom } from 'rxjs/operators';
import * as fromAuth from './../reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {


  constructor(private router: Router, private store: Store) {  }


  canLoad(): Observable<boolean | UrlTree> {
    return this.store.pipe(
      select(fromAuth.isLoginPending),
      first(pending => !pending),
      withLatestFrom(
        this.store.pipe(select(fromAuth.isLoggedIn))
      ),
      map(([, isLoggedIn]) =>{
        if(!isLoggedIn) return this.router.parseUrl('/login')
        return true
      }),
      take(1)
    );
  }


}
