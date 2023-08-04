import { Component, OnInit } from '@angular/core';
import {
  GetplatformsService,
  Platform,
} from 'src/app/services/getplatforms.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  platforms: Platform[] = [];

  constructor(private platformsService: GetplatformsService) {}

  ngOnInit(): void {
    this.platformsService.getPlatforms().subscribe((data) => {
      this.platforms = data;
    });
  }
}
