import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUserCount(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/dashboard/user-count`);
  }

  getBlogsCount(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/dashboard/blog-count`);
  }
  
  getNewsCount(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/dashboard/news-count`);
  }
}
