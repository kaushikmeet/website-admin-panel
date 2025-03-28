import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';

Injectable({
  providedIn: 'root'
})

export class AuthService{
  getToken(): string | null{
    return localStorage.getItem('token');
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSRV = new AuthService();
  const token = authSRV.getToken();

  if(token){
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
