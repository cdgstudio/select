import { Directive, inject } from '@angular/core';
import { Observable, forkJoin, map, switchMap, timer } from 'rxjs';
import { SelectDataSource } from '../../shared/select';
import { Country, CountryService } from './country.service';

@Directive({
  selector: '[countryDataSource]',
  standalone: true,
  providers: [
    {
      provide: SelectDataSource,
      useExisting: CountryDataSourceDirective,
    },
  ],
})
export class CountryDataSourceDirective implements SelectDataSource<Country> {
  private service = inject(CountryService);

  getOptions(searchValue$: Observable<string>) {
    return searchValue$.pipe(
      switchMap((searchValue) =>
        forkJoin([
          this.service.countries$,
          timer(500), // fake delay
        ]).pipe(map(([countries]) => countries.filter((country) => country.name.includes(searchValue)).slice(0, 15))),
      ),
    );
  }

  getBindedValue(value: Country): unknown {
    return value.code;
  }
}
