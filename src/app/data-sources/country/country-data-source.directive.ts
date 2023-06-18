import { Directive, inject } from '@angular/core';
import { SelectDataSource } from '../../shared/select';
import { Observable, combineLatest, forkJoin, map, switchMap, timer } from 'rxjs';
import { CountryService } from './country.service';

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
export class CountryDataSourceDirective implements SelectDataSource {
  private service = inject(CountryService);

  getOptions(searchValue$: Observable<string>) {
    return searchValue$.pipe(
      switchMap((searchValue) =>
        forkJoin([
          this.service.countries$,
          timer(500), // fake delay
        ]).pipe(map(([countries]) => countries.filter((country) => country.name.includes(searchValue)).slice(0, 5))),
      ),
    );
  }
}
