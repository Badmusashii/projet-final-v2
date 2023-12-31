import { Component, EventEmitter, Output } from '@angular/core';
import { MediaService } from 'src/app/services/mediaservice.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-putmediabar',
  templateUrl: './putmediabar.component.html',
  styleUrls: ['./putmediabar.component.css'],
})
export class PutmediabarComponent {
  platformId!: number;
  constructor(
    private mediaservice: MediaService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => (this.platformId = +params['id']));
  }
  searchText: string = '';

  @Output() search = new EventEmitter<string>();

  onKeyup() {
    this.search.emit(this.searchText);
  }
  addMediaToUserAndPlatform() {
    this.mediaservice.addMediaToUserAndPlatform(
      this.platformId,
      // this.searchText
      { title: this.searchText }
    );
    // console.log('platform id : ' + this.platformId);
    // console.log('le media : ' + this.searchText);
  }
}
