import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CountryDataSourceDirective } from './data-sources/country/country-data-source.directive';
import { SelectModule } from './shared/select';
import { CountrySelectOptionComponent } from './data-sources/country/country-option.component';
import { RepositoryOptionComponent } from './data-sources/repository/repository-option.component';
import { RepositoryDataSourceDirective } from './data-sources/repository/repository-data-source.directive';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: `app.component.html`,
  styles: [
    `
      :host {
        @apply w-full max-w-xl m-auto my-4 block;
      }
    `,
  ],
  standalone: true,
  imports: [
    SelectModule,
    ReactiveFormsModule,
    CountrySelectOptionComponent,
    CountryDataSourceDirective,
    RepositoryOptionComponent,
    RepositoryDataSourceDirective,
    JsonPipe,
  ],
})
export class AppComponent {
  form = new FormGroup({
    githubProfile: new FormControl(),
    country: new FormControl(),
  });
}
