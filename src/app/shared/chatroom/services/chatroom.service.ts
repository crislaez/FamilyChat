import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { from, Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../user/models';


@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  constructor(private firebase: AngularFireDatabase) { }


  getChatrooms(chats:any): Observable<any>{
    // console.log(Object.values(chats))
    return this.firebase.list('/chatrooms').snapshotChanges().pipe(
      map(response => {
        return response.map(item => {
          console.log(item)
          return {
            $key:item?.key,
            value:{
              image: (item.payload.toJSON() as any)?.image,
              name: (item.payload.toJSON() as any)?.name
            }
          }
        }).filter(({$key}) => Object.values(chats).includes($key))
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

  deleteMessageByChatroom(messagekey: string, key: string): Observable<any>{
    return from(this.deleteMessage(messagekey, key)).pipe(
      map(response => {
        if(response?.error){
          throw throwError({error: response?.error}) //forzar el error
        }
        return response
      })
    )
  }

  createChatroom(user: User, userLogin: User): Observable<any>{
    return from(this.createChatroomWhitFirebase(user, userLogin)).pipe(
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

      const response = await this.firebase.list('/chatrooms').push(body)
      return {response}
    }
    catch(error){
      return {error: error.message}
    }
  }

  async deleteMessage(messagekey: string, key: string): Promise<any>{
    try{
      const response = await this.firebase.list(`/chatrooms/${key}/messages/${messagekey}`).remove()
      return {response}
    }
    catch(error){
      return {error: error.message}
    }
  }

  async createChatroomWhitFirebase(user: User, userLogin: User): Promise<any>{
    try{
      console.log(user) //"-MeVqWKax-aQ4nWB6ff0" -MeVqWKax-aQ4nWB6ff0
      console.log(userLogin) //"RkPSa7aeUbRmTkPpCJaMWHQJH773"  -MeHP3vs6ZG2JH2UfZfA

      const message = {
        image:'',
        messages:'',
        name:''
      }

      const responseCreateChat = await this.firebase.list(`/chatrooms`).push({ image:'',
        messages:'',
        name:''
      })

      console.log(responseCreateChat?.key)
      const responseUserPushChat = await this.firebase.list(`/users/${user?.$key}/chats`).push(responseCreateChat?.key)
      const responseUserloginPushChat = await this.firebase.list(`/users/${userLogin?.$key}/chats`).push(responseCreateChat?.key)
      return {responseCreateChat}
    }
    catch(error){
      return {error: error.message}
    }
  }

}
