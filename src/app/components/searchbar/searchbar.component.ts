import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent {
  searchText: string = '';

  @Output() search = new EventEmitter<string>();

  onKeyup() {
    // Constante pour la desinfection du champs
    // Eviter < > & pour proteger un peu des attaques XSS
    const sanitizedInput = this.searchText.replace(/[^a-zA-Z0-9 ]/g, '');
    this.search.emit(sanitizedInput);
  }
}
