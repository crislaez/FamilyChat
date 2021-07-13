import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@capacitor/storage';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { User } from '../models';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private firebase: AngularFireDatabase) { }


  getusers(): Observable<any> {
    return this.firebase.list('/users').snapshotChanges().pipe(
      map(users => {
        return users.map(user => {

          return  {
            $key: user?.key,
            name: (user.payload.toJSON() as any)?.name,
            email: (user.payload.toJSON() as any)?.email,
            ui: (user.payload.toJSON() as any)?.ui,
            create_at: (user.payload.toJSON() as any)?.create_at,
            avatar: (user.payload.toJSON() as any)?.avatar,
            chats: (user.payload.toJSON() as any)?.chats || ''
          }
        })
      })
    )
  }



}
