import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  httpOptions={
      headers: new HttpHeaders({
        "Content-Type":"application/json",
        "Access-Control-Allow-Origin":"***"
      })
    }

  private apiUrl= 'http://localhost:3000/api/blogs';

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/all-blogs');
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  createBlog(blogData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, blogData);
  }

  singleBlog(id:number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
  updateBlog(id: number, blogData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, blogData);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getBlogBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/?slug=${slug}`, this.httpOptions);
  }
}
