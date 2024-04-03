import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/v1/payments';

  constructor(private http: HttpClient) {}

  getPayments(page: number): Observable<any> {
    // Basic Auth Header
    let headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('user:userPass') // Replace 'username:password' with actual credentials
    });

    let params = new HttpParams().set('page', page.toString());

    return this.http.get(`${this.apiUrl}`, { headers: headers, params: params });
  }
}
