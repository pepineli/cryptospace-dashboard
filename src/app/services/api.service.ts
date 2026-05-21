import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getCryptos(currency: string = 'brl', perPage: number = 20): Observable<any> {
    const url = 'https://api.coingecko.com/api/v3/coins/markets';
    const params = {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: perPage.toString(),
      page: '1',
      sparkline: 'false'
    };
    return this.http.get(url, { params });
  }

  getCryptoHistory(id: string, days: number = 7): Observable<any> {
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart`;
    const params = {
      vs_currency: 'brl',
      days: days.toString()
    };
    return this.http.get(url, { params });
  }
}