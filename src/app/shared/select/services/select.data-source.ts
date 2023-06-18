import { Observable, delay, of } from 'rxjs';

export abstract class SelectDataSource {
  abstract getOptions(searchValue$: Observable<string>): Observable<unknown[]>;
}
