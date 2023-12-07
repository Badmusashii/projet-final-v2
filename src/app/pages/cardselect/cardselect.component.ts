import { Component, OnInit } from '@angular/core';
import {
  GetplatformsService,
  Platform,
} from 'src/app/services/getplatforms.service';
import { ToggleService } from 'src/app/services/toggleservice.service';

@Component({
  selector: 'app-cardselect',
  templateUrl: './cardselect.component.html',
  styleUrls: ['./cardselect.component.css'],
})
export class CardselectComponent implements OnInit {
  platforms: Platform[] = [];
  toggles: { [key: number]: boolean } = {};
  isDataLoaded: boolean = false;
  lenght!: number;

  constructor(
    private platformsService: GetplatformsService,
    private toggleService: ToggleService
  ) {}

  // ngOnInit(): void {
  //   this.platformsService.getPlatforms().subscribe((data) => {
  //     this.platforms = data;
  //     this.isDataLoaded = true;
  //   });
  //   this.toggles = this.toggleService.getCurrentToggles();
  //   this.toggleService.toggles$.subscribe((toggles) => {
  //     this.toggles = toggles;
  //   });
  //   console.log(this.platforms.length);
  // }
  ngOnInit(): void {
    this.platformsService.getPlatforms().subscribe((data) => {
      this.platforms = data;
      this.toggles = this.toggleService.getCurrentToggles();
      this.toggleService.toggles$.subscribe((toggles) => {
        this.toggles = toggles;
      });
      this.lenght = this.platforms.length;

      this.isDataLoaded = true;
    });
  }
  isObjectEmpty(obj: Object): boolean {
    // return Object.keys(obj).length === 0;
    return !Object.values(obj).some((value) => value === true);
  }
}
