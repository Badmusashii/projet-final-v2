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
    this.search.emit(this.searchText);
  }
}
