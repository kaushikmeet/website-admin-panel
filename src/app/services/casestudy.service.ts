import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasestudyService {

httpOptions={
      headers: new HttpHeaders({
        "Content-Type":"application/json",
        "Access-Control-Allow-Origin":"***"
      })
    }

  private apiURL= 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  getCaseStudy(): Observable<any>{
    return this.http.get(`${this.apiURL}/api/case-study`)
  }

  createCaseStudy(caseStudyData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/api/case-study`, caseStudyData);
  }

  singleCaseStudy(id:number): Observable<any>{
    return this.http.get<any>(`${this.apiURL}/api/case-study/${id}`, this.httpOptions);
  }
  updateCaseStudy(id: number, caseStudyData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/api/case-study/${id}`, caseStudyData);
  }

  deleteCaseStudy(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/api/case-study/${id}`);
  }
}
