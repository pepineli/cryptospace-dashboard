import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://func-crypto-api.azurewebsites.net/api/cryptos';
  private cache: any = {};
  private cacheDuration = 300000; // 5 minutos

  constructor(private http: HttpClient) { }

  getCryptos(currency: string = 'brl', perPage: number = 20): Observable<any> {
    const cacheKey = `cryptos_${perPage}`;
    const cached = this.cache[cacheKey];
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheDuration) {
      return of(cached.data);
    }
    
    return this.http.get(`${this.apiUrl}?perPage=${perPage}`).pipe(
      tap(data => {
        this.cache[cacheKey] = {
          data: data,
          timestamp: Date.now()
        };
      })
    );
  }

  getCryptoHistory(id: string, days: number = 7): Observable<any> {
    const cacheKey = `history_${id}`;
    const cached = this.cache[cacheKey];
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheDuration) {
      return of(cached.data);
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=brl&days=${days}`;
    return this.http.get(url).pipe(
      tap(data => {
        this.cache[cacheKey] = {
          data: data,
          timestamp: Date.now()
        };
      })
    );
  }
}