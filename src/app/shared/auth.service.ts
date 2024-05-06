import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import {WebSocketService} from './web-socket.service'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,private websocket:WebSocketService) { }

  setToken(token:string){
    localStorage.setItem('token',token);
  }

  setRole(role:string){
    localStorage.setItem('role',role);
  }

  setType(type:string){
    localStorage.setItem('type',type);
  }

  getType(){
    return localStorage.getItem('type');
  }

  getRole(){
    return localStorage.getItem('role');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  setRefreshToken(refresh:string){
    localStorage.setItem('refresh',refresh);
  }

  getRefreshToken(){
    return localStorage.getItem('refresh');
  }

  isLoggedIn(){
    return this.getToken() != null
  }



  logout(url=''){  
    if(localStorage.getItem("loginData") != undefined){
      this.websocket.leaveRoom(JSON.parse(localStorage.getItem("loginData"))._id)
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('refresh');
      localStorage.removeItem('loginData');
      localStorage.removeItem('adminData');
      localStorage.removeItem('profileData');
      localStorage.removeItem('menuTitle');
      localStorage.removeItem('staffData');
      localStorage.removeItem('type');


    }  
    
    if(url!='')
    {
      
      this.router.navigate([url]);
    }
    else
    {
    this.router.navigate(['/patient']);
    }    
  
  }

  login({email,password}:any){
    if(email == 'admin@gmail.com' && password =='admin1234'){
      // let customToken = JSON.stringify('abcdefghijklmnopqrstuvwxyz');
      // this.setToken(customToken);

      return of({name:'swapnil don',email:'admin@gmail.com',status:'Notverified',jwtToken:'abcdefghijklmnopqrstuvwxyz'})
    }
    return throwError(()=> new Error('Failed To Login'))
  }
}
