import { Component, Input } from '@angular/core';
import { Platform } from 'src/app/services/getplatforms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() platform!: Platform;

  constructor(private router: Router) {}

  goToDetail() {
    this.router.navigate(['/platform', this.platform.id]);
  }
}
