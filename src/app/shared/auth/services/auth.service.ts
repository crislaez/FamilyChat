import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@capacitor/storage';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Credentials, User } from '../models';
// import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  public _token: string;
  private readonly TOKEN_LABEL = 'API_FAMILYCHAT_TOKEN';
  // private readonly key = CryptoJS.enc.Utf8.parse("11221123342123");
  // private readonly iv = CryptoJS.enc.Utf8.parse("7712333123");


  constructor(private http: HttpClient, private auth: AngularFireAuth, private firebase: AngularFireDatabase) { }


  login(email: string, password: string): Observable<any> {

    return from(this.logintWhitFirebase(email, password)).pipe(
      switchMap((response) => {
        if(response?.error){
          return throwError({error: response?.error}) //forzar el error
         }

        return this.firebase.list('/users').snapshotChanges().pipe(
          map(users => {

            if(!response) throw throwError({error: response?.error})  //hay que colocar esto aqui porque se recarga esta funcion de firebase

            const loginUi = response?.userCredential?.user?.uid
            const userLogIn = users.find((user: any) => user?.payload.toJSON().ui === loginUi)

            this.saveLocalToken(response?.userCredential?.user?.uid);
            response = null //hay que colocar esto aqui porque se recarga esta funcion de firebase
            return {
              $key: userLogIn?.key,
              name: (userLogIn.payload.toJSON() as any)?.name,
              email: (userLogIn.payload.toJSON() as any)?.email,
              ui: (userLogIn.payload.toJSON() as any)?.ui,
              create_at: (userLogIn.payload.toJSON() as any)?.create_at,
              avatar: (userLogIn.payload.toJSON() as any)?.avatar,
              chats: (userLogIn.payload.toJSON() as any)?.chats || ''
            }
          })
        )
      }),
      catchError((error) =>{
        return throwError(error?.error?.message)
      })
    )
  }

  register(email:string, password:string, name:string): Observable<User> {
    return from(this.registerWhitFirebase(email, password, name)).pipe(
      map(response => {
        if(response?.error){
          throw throwError({error: response?.error}) //forzar el error
        }
        return response?.userCredential
      })
    )
  }

  autologin(): Observable<any> {
    return from(this.getLocalToken()).pipe(
      switchMap( (token) => {
        this._token = token
        if (!this._token) return throwError({ message: 'Token not found' });

        return this.firebase.list('/users').snapshotChanges().pipe(
          map(users => {
            const userLogIn = users.find((user: any) => user?.payload.toJSON().ui === token)
            return {
              $key: userLogIn?.key,
              name: (userLogIn.payload.toJSON() as any)?.name,
              email: (userLogIn.payload.toJSON() as any)?.email,
              ui: (userLogIn.payload.toJSON() as any)?.ui,
              create_at: (userLogIn.payload.toJSON() as any)?.create_at,
              avatar: (userLogIn.payload.toJSON() as any)?.avatar,
              chats: (userLogIn.payload.toJSON() as any)?.chats || ''
            }
          })
        )
      })
    )
  }

  logout(): void {
    // console.log(this.getLocalToken())
    // console.log(this._token)
    this.auth.signOut();
    this.removeLocalToken()
    this._token = null;
    // console.log(this.getLocalToken())
    // console.log(this._token)
  }

  getUserInfo(credentials?: Credentials): Observable<User> {
    return of(credentials)
  }

  // LOGIN FIREBASE
  async logintWhitFirebase(email:string, password:string): Promise<any>{
    try{
      const userCredential =  await this.auth.signInWithEmailAndPassword(email, password)
      return {userCredential}
    }
    catch(error){
      return {error: error.message}
    }
  }

  // REGISTER FIREBASE
  async registerWhitFirebase(email:string, password:string, name:string): Promise<any>{
    try{
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const ui = userCredential?.user?.uid || '';

      try{
        const newDate = new Date();
        const create_at = newDate.getTime();

        const response = await this.firebase.list('/users').push({name, email, password, ui, create_at, avatar:'', chats:['-Me4gjWhJZhxkwowxrvc']})
        return {response}
      }
      catch(error){
        return {error: error.message}
      }
    }
    catch(error){
      return {error: error.message}
    }
  }

  //***************************** STORAGE *****************************
  // SAVE TOKEN
  async saveLocalToken(token: string){
    this._token = token
    await Storage.set({key: this.TOKEN_LABEL, value: token})
  }

  // GET TOKEN
  async getLocalToken(){
    const token = await Storage.get({key: this.TOKEN_LABEL})
    return await token?.value
  }

  // REMOVE TOKEN
  async removeLocalToken(){
    await Storage.remove({key: this.TOKEN_LABEL})
  }


  // getHeaders(): HttpHeaders {
  //   const language = this.translate.currentLang;
  //   return new HttpHeaders({
  //     'Accept-Language': language,
  //     Authorization: `Bearer ${this._token}`,
  //     // 'Content-Type':'application/force-download',
  //     'Content-Type': 'application/json',
  //     // 'Content-Type': 'multipart/form-data'
  //     // 'enctype': 'multipart/form-data'
  //   });
  // };


}
