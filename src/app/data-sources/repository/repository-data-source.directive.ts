import { Directive, inject } from '@angular/core';
import { Observable, debounceTime, switchMap } from 'rxjs';
import { SelectDataSource } from '../../shared/select';
import { Repository, RepositoryItem, RepositoryService } from './repository.service';

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
export class RepositoryDataSourceDirective implements SelectDataSource<RepositoryItem> {
  private service = inject(RepositoryService);

  getOptions(searchValue$: Observable<string>) {
    return searchValue$.pipe(
      debounceTime(500),
      switchMap((searchValue) => this.service.repositories({ searchValue })),
    );
  }

  getBindedValue(value: RepositoryItem): string {
    return value.name;
  }
}
