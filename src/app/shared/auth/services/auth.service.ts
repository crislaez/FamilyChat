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
        if(response?.error) return throwError({error: response?.error})

        return this.getUserInFirebase(response?.userCredential?.user?.uid, true)
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
        this._token = token;

        if (!this._token) return throwError({ message: 'Token not found' });

        return this.getUserInFirebase(token,false)
      }),
      catchError((error) =>{
        return throwError(error?.error?.message)
      })
    )
  }

  logout(): Observable<any> {
    return from(this.logOutFirebase()).pipe(
      map(response =>{
        this.removeLocalToken()
        this._token = null;
        return response
      })
    )
  }

  getUserInFirebase(UserLoginKey: string, sabeToken:boolean): Observable<any> {
    return this.firebase.list('/users', ref => ref.orderByChild('ui').equalTo(UserLoginKey)).snapshotChanges().pipe(
      map(([user]) => {
        // console.log(user)
        if(sabeToken) this.saveLocalToken(UserLoginKey);

        return  {
          $key: user?.key,
          name: (user?.payload.toJSON() as any)?.name,
          email: (user?.payload.toJSON() as any)?.email,
          ui: (user?.payload.toJSON() as any)?.ui,
          create_at: (user?.payload.toJSON() as any)?.create_at,
          avatar: (user?.payload.toJSON() as any)?.avatar,
          chats: (user?.payload.toJSON() as any)?.chats || '',
          type:user?.type
        }
      })
    )
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
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password); //registro Authentication
      const ui = userCredential?.user?.uid || '';

      const newDate = new Date();
      const create_at = newDate.getTime();
      const response = await this.firebase.list('/users').push({name, email, password, ui, create_at, avatar:'', chats:''}) //crear usuario en RealTime database
      const result = await await this.firebase.list(`/users/${response?.key}/chats`).push('-Me4gjWhJZhxkwowxrvc'); //agregar chat publico en campo chat recien creado

      return {response}
    }
    catch(error){
      return {error: error.message}
    }
  }

  //LOGOUT
  async logOutFirebase(): Promise<any>{
    try{
      const response = await this.auth.signOut()
      return response
    }catch(error){
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
