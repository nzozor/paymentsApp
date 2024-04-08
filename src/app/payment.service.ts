import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {StatusFilter} from "./payments/payments.component";
import { formatDate } from '@angular/common';

export interface IFilterTypes {
  status: StatusFilter,
  createdAtEnd: Date,
  createdAtStart: Date,
}
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/v1/payments';

  constructor(private http: HttpClient,@Inject(LOCALE_ID) private locale: string) {}

  getPayments(page: number, filter: Partial<IFilterTypes>): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('user:userPass')
    });
    let params = new HttpParams().set('page', page.toString())
     .set('status', filter.status? filter.status.toString(): '')
     .set('createdAtStart', filter.createdAtStart? formatDate(filter.createdAtStart,'yyyy-MM-dd', this.locale).toString(): '')
     .set('createdAtEnd', filter.createdAtEnd? formatDate(filter.createdAtEnd,'yyyy-MM-dd', this.locale).toString() : '')
    return this.http.get(`${this.apiUrl}`, { headers: headers, params: params });

  }
}
