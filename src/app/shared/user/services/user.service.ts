import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
