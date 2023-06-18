import { Component, Input } from '@angular/core';
import { Country } from './country.service';

@Component({
  selector: 'app-country-select-option',
  template: `
    <span class="flag">{{ data.emoji }}</span>
    <span class="name">{{ data.name }}</span>
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: 1rem;
      }
    `,
  ],
  standalone: true,
})
export class CountrySelectOptionComponent {
  @Input({ required: true }) data!: Country;
}
