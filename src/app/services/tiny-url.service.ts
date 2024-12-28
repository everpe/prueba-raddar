import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTinyUrlRequest, DecodeTinyUrlResponse, TinyUrlResponse } from '../interfaces/Tiny.Interface';

@Injectable({
  providedIn: 'root'
})
export class TinyUrlService {
  private apiUrl = 'https://api.tinyurl.com';
  private apiToken = '3vBkgC8bxEhQ0hFSTB1kYVuJ1NJn5XMDO4NW0SYrpVe7VXH2cnZEYeUB39H2';

  constructor(private http: HttpClient) {}

  // Método para acortar una URL
  encode(request: CreateTinyUrlRequest): Observable<TinyUrlResponse> {
    const params = new HttpParams().set('api_token', this.apiToken);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<TinyUrlResponse>(`${this.apiUrl}/create?${params.toString()}`, request, { headers });
  }
  
// Método para decodificar una URL corta
decode(domain: string, alias: string): Observable<DecodeTinyUrlResponse> {
  const params = new HttpParams().set('api_token', this.apiToken);

  return this.http.get<DecodeTinyUrlResponse>(
    `${this.apiUrl}/alias/${domain}/${alias}?${params.toString()}`
  );
}
}
