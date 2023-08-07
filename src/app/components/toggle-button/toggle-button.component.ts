import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToggleService } from 'src/app/services/toggleservice.service';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.css'],
})
export class ToggleButtonComponent {
  @Input() on: boolean = false;
  @Output() toggle = new EventEmitter<boolean>();

  handleToggle() {
    this.on = !this.on;
    this.toggle.emit(this.on);
  }
}
