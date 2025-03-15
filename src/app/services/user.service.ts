import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class UserService {

  httpOptions={
    headers: new HttpHeaders({
      "Content-Type":"application/json",
      "Access-Control-Allow-Origin":"***"
    })
  }  

   private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

   createUser(user_detail: any): Observable<any>{
    return this.http.post<any>(this.apiUrl, user_detail + this.httpOptions);
   }
   getUser(){
    return this.http.get(this.apiUrl + this.httpOptions);
   }
}
