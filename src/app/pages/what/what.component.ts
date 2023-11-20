import { Component } from '@angular/core';
import { MediaService } from 'src/app/services/mediaservice.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-what',
  templateUrl: './what.component.html',
  styleUrls: ['./what.component.css'],
  animations: [
    trigger('mediaAnimation', [
      state('void', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('*', style({ transform: 'translateX(0)', opacity: 1 })),
      transition(':enter', [animate('0.8s ease-out')]),
      transition(':leave', [
        animate(
          '0.8s ease-out',
          style({ transform: 'translateX(-100%)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('textColorChange', [
      state(
        'changed',
        style({
          color: '#cc35c0',
        })
      ),
      transition('void => changed', [
        style({
          color: '#49c7d8',
        }),
        animate('1s ease-in-out'),
      ]),
    ]),
  ],
})
export class WhatComponent {
  randomMediaTitle: string = '';
  randomMediaPoster: string = '';
  randomMediaId: number = 0;
  randomMediaType: string = '';
  random: boolean = false;
  titleAnimationDone = false;
  posterAnimationDone = false;

  constructor(private mediaService: MediaService, private router: Router) {}

  mediaAnimDone(event: any) {
    console.log(event);
    if (event.toState === null) {
      this.titleAnimationDone = true;
      this.posterAnimationDone = true;
    }
  }

  moreInfo() {
    console.log('click', this.randomMediaId);
    if (this.randomMediaType === 'film') {
      this.router.navigateByUrl(
        `/movieInfo/${this.randomMediaId}?nobutton=true`
      );
    } else if (this.randomMediaType === 'jeu') {
      this.router.navigateByUrl(
        `/gameInfo?guid=${this.randomMediaId}&nobutton=true`
      );
    } else {
      console.error('Type de média inconnu');
    }
  }
  getRandomMedia(type: string): void {
    this.random = false;

    setTimeout(() => {
      this.random = true;
      this.titleAnimationDone = false;
      this.posterAnimationDone = false;
      this.mediaService.getRandomTitle(type).subscribe({
        next: (media) => {
          console.log(media);
          this.randomMediaTitle = media.title;
          this.randomMediaPoster = media.poster;
          this.randomMediaId = media.id;
          this.randomMediaType = this.determineMediaType(media.id);
          console.log(this.randomMediaType);
        },
        error: (err) => {
          console.error(
            'Erreur lors de la récupération du titre aléatoire',
            err
          );
        },
      });
    }, 850);
  }
  determineMediaType(id: string): 'film' | 'jeu' {
    if (id.includes('-')) {
      return 'jeu';
    } else {
      return 'film';
    }
  }
}
