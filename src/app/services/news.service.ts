import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

httpOptions={
   headers: new HttpHeaders({
   "Content-Type":"application/json",
   "Access-Control-Allow-Origin":"***"
   })
}

  private apiUrl = 'http://localhost:3000/api/news';

  constructor(private http: HttpClient) { }

    getNews(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
  
    createNews(newsData: FormData): Observable<any> {
      return this.http.post<any>(this.apiUrl, newsData);
    }
  
    singleNews(id:number): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/${id}`, this.httpOptions);
    }
    updateNews(id: number, newsData: FormData): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, newsData);
    }
  
    deleteNews(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

}
