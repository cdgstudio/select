import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { shareReplay } from 'rxjs';

export interface Country {
  name: string;
  code: string;
  emoji: string;
  unicode: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  countries$ = this.getCountries().pipe(shareReplay(1));

  private getCountries() {
    return this.http.get<Country[]>(`https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json`);
  }
}
