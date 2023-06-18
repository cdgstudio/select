import { Observable } from 'rxjs';

export abstract class SelectDataSource<T> {
  abstract getOptions(searchValue$: Observable<string>): Observable<T[]>;

  abstract getBindedValue(value: T): unknown;
}
