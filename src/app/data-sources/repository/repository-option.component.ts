import { Component, Input } from '@angular/core';
import { Repository } from './repository.service';

@Component({
  selector: 'app-repository-option',
  template: `
    <span class="avatar">
      <img [src]="data.owner.avatar_url" alt="data.name" />
    </span>
    <span class="name">{{ data.name }}</span>
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .avatar {
        flex: 0 0 2rem;
      }

      img {
        width: 2rem;
      }

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ],
  standalone: true,
})
export class RepositoryOptionComponent {
  @Input({ required: true }) data!: Repository['items'][number];
}
