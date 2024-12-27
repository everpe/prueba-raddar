import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTinyUrlRequest, TinyUrlResponse } from '../interfaces/Tiny.Interface';



@Injectable({
  providedIn: 'root'
})
export class TinyUrlService {
  private apiUrl = 'https://api.tinyurl.com/create';
  private apiToken = '3vBkgC8bxEhQ0hFSTB1kYVuJ1NJn5XMDO4NW0SYrpVe7VXH2cnZEYeUB39H2';

  constructor(private http: HttpClient) {}

  // Método para acortar una URL
  encode(request: CreateTinyUrlRequest): Observable<TinyUrlResponse> {
    const params = new HttpParams().set('api_token', this.apiToken);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<TinyUrlResponse>(`${this.apiUrl}?${params.toString()}`, request, { headers });
  }
  
  decode(domain: string, alias: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
    };
  
    return this.http.get(`${this.apiUrl}/alias/${domain}/${alias}`, { headers });
  }
  
}
