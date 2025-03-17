import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {}

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password }, this.httpOptions);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.roleId;
    }
    return '';
  }

  register(userData: { username: string; password: string; roleId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
