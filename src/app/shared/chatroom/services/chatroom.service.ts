import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  constructor(private firebase: AngularFireDatabase) { }


  getChatrooms(): Observable<any>{
    return this.firebase.list('/chatrooms').snapshotChanges().pipe(
      map(response => {
        return response.map(item => {
          return {
            $key:item?.key,
            value:item.payload.toJSON()
          }
        })
      }),
      catchError(error => {
        return throwError(error)
      })
    )
  }

  getChatroomByKey(key: string): Observable<any>{
    return this.firebase.list('/chatrooms').snapshotChanges().pipe(
      map(response => {
        const chatroom = response?.find((item) => item?.key === key)
        return {
          $key: chatroom?.key,
          name: (chatroom.payload.toJSON() as any)?.name,
          image: (chatroom.payload.toJSON() as any)?.image,
          messages: (chatroom.payload.toJSON() as any)?.messages,
        }
      }),
      catchError(error => {
        return throwError(error)
      })
    )
  }

  saveMessageByChatroom(message: any, key:string): Observable<any>{
    return from(this.saveMessage(message, key)).pipe(
      map(response => {
        if(response?.error){
          throw throwError({error: response?.error}) //forzar el error
        }
        return response
      })
    )
  }

  async saveMessage(message: any, key:string): Promise<any>{
    try{
      const response = await this.firebase.list(`/chatrooms/${key}/messages`).push(message)
      // const response = await this.firebase.database.ref(`/chatrooms/${key}`).child('messages').set(message)
      return {response}
    }
    catch(error){
      console.log(error)
      return {error: error.message}
    }
  }

  async createChat(): Promise<any>{
    try{

      const body = {
        image:"https://firebasestorage.googleapis.com/v0/b/familychat-bc5af.appspot.com/o/images%2Fpublic_chat.png?alt=media&token=2b6f7dc9-8bc3-46e4-8362-77f0286ac572",
        messages:'',
        name:'Public'
      }

      // const body = {
      //   image:"https://firebasestorage.googleapis.com/v0/b/familychat-bc5af.appspot.com/o/images%2Fimage_not_found.png?alt=media&token=b6c42cea-a1ff-47a4-8b3e-067c3869d621",
      //   messages:'',
      //   name:'Test'
      // }

      // const body = {
      //   image:"https://firebasestorage.googleapis.com/v0/b/familychat-bc5af.appspot.com/o/images%2Fbulbasaur.png?alt=media&token=6c261c81-709b-490a-b18e-596d2bfff3b5",
      //   messages:'',
      //   name:'Bulbasaour'
      // }

      // const body = {
      //   image:"https://firebasestorage.googleapis.com/v0/b/familychat-bc5af.appspot.com/o/images%2Fsquirtle.png?alt=media&token=0b601f8f-c959-460b-8af2-3ee54574d00a",
      //   messages:'',
      //   name:'Squirtle'
      // }

      // const body = {
      //   image:"https://firebasestorage.googleapis.com/v0/b/familychat-bc5af.appspot.com/o/images%2Fcharmander.png?alt=media&token=c5ca0f93-443c-4f43-93ad-bb16714f4d2d",
      //   messages:'',
      //   name:'Charmander'
      // }

      // const body = {
      //   image:"https://firebasestorage.googleapis.com/v0/b/familychat-bc5af.appspot.com/o/images%2Fpikachu.png?alt=media&token=57fa60f8-6089-4e3d-9f0e-5afdbb6f2239",
      //   messages:'',
      //   name:'Pikachu'
      // }

      const response = await this.firebase.list('/chatrooms').push(body)
      return {response}
    }
    catch(error){
      return {error: error.message}
    }
  }


}
