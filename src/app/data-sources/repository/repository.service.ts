import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Repository {
  items: RepositoryItem[];
}

export interface RepositoryItem {
  name: string;
  owner: {
    avatar_url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private httpClient = inject(HttpClient);

  repositories(args: { searchValue: string }): Observable<Repository['items']> {
    const url = 'https://api.github.com/search/repositories';

    const params = new HttpParams({
      fromObject: {
        q: args.searchValue || 'a',
        per_page: 5,
      },
    });

    return this.httpClient.get<Repository>(url, { params }).pipe(map((response) => response.items));
  }
}
