import { Directive, inject } from '@angular/core';
import { SelectDataSource } from '../../shared/select';
import { Observable, combineLatest, debounceTime, forkJoin, map, switchMap, timer } from 'rxjs';
import { CountryService } from '../country/country.service';
import { RepositoryService } from './repository.service';

@Directive({
  selector: '[repositoryDataSource]',
  standalone: true,
  providers: [
    {
      provide: SelectDataSource,
      useExisting: RepositoryDataSourceDirective,
    },
  ],
})
export class RepositoryDataSourceDirective implements SelectDataSource {
  private service = inject(RepositoryService);

  getOptions(searchValue$: Observable<string>) {
    return searchValue$.pipe(
      debounceTime(500),
      switchMap((searchValue) => this.service.repositories({ searchValue })),
    );
  }
}
