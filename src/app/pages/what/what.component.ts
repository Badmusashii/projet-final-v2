import { Component } from '@angular/core';
import { MediaService } from 'src/app/services/mediaservice.service';

@Component({
  selector: 'app-what',
  templateUrl: './what.component.html',
  styleUrls: ['./what.component.css'],
})
export class WhatComponent {
  randomMediaTitle: string = '';
  randomMediaPoster: string = '';
  random: boolean = false;

  constructor(private mediaService: MediaService) {}

  getRandomMedia(type: string): void {
    this.random = true;
    this.mediaService.getRandomTitle(type).subscribe({
      next: (media) => {
        console.log(media);
        this.randomMediaTitle = media.title;
        this.randomMediaPoster = media.poster; // Assurez-vous que 'title' est la propriété correcte
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du titre aléatoire', err);
        // Gérer l'erreur comme vous le souhaitez
      },
    });
  }
}
