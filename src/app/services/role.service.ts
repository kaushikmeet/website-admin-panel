import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  
  constructor() { }

  getUserRole(): number {
    const token = localStorage.getItem('token');
    if(token){
    const decodedToken = this.decodeToken(token); 
      return parseInt(decodedToken.roleId, 10); 
   }
   return 0;
  }
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
