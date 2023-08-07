import { Component, Input } from '@angular/core';
import { Platform } from 'src/app/services/getplatforms.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() platform!: Platform;
}
