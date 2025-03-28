import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private tokenExpirationTimer: any;
  constructor(private router: Router) { }

  login(token: string) {
    localStorage.setItem('token', token);
    const expirationTime = this.getTokenExpiration(token);

    if (expirationTime) {
      this.startLogoutTimer(expirationTime);
    }
  }

  private getTokenExpiration(token: string): number | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken?.exp ? decodedToken.exp * 1000 : null;  // Convert to milliseconds
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  private startLogoutTimer(expirationTime: number) {
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    // Set a timeout to log out the user when the token expires
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, timeRemaining);
  }

  logout() {
    localStorage.removeItem('token');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const expirationTime = this.getTokenExpiration(token);
      return expirationTime ? Date.now() < expirationTime : false;
    }
    return false;
  }
}
