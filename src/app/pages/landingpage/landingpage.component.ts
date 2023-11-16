import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})
export class LandingpageComponent {
  scrollPosition = 0;
  h1Opacity: number = 1;
  firstPOpacity: number = 1;
  secondPOpacity: number = 1;
  firstPTransform: string = 'translateX(0)';
  secondPTransform: string = 'translateX(0)';
  biblioOpacity: number = 0;
  biblioTransform: string = 'translateX(-100px)';
  infoOpacity: number = 0;
  infoTransform: string = 'translateY(100px)';
  cloudOpacity: number = 0;
  cloudTransform: string = 'translateX(100px)';

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    this.scrollPosition = window.scrollY || document.documentElement.scrollTop;

    if (this.scrollPosition > 210) {
      const startTransitionAt = 210; // Début de l'animation
      const transitionRange = 100; // Plage sur laquelle l'animation se produit
      const progress = Math.min(
        (this.scrollPosition - startTransitionAt) / transitionRange,
        1
      );

      this.biblioOpacity = progress;
      this.biblioTransform = `translateX(${-100 + 100 * progress}px)`;
      this.infoOpacity = progress;
      this.infoTransform = `translateY(${100 - 100 * progress}px)`;
      this.cloudOpacity = progress;
      this.cloudTransform = `translateX(${100 - 100 * progress}px)`;
    } else {
      this.biblioOpacity = 0;
      this.biblioTransform = 'translateX(-100px)';
      this.infoOpacity = 0;
      this.infoTransform = 'translateY(100px)';
      this.cloudOpacity = 0;
      this.cloudTransform = 'translateX(100px)';
    }

    if (this.scrollPosition > 70) {
      const opacity = Math.max(1 - (this.scrollPosition - 70) / 100, 0);
      this.firstPOpacity = opacity;
      this.secondPOpacity = opacity;

      const translateDistance = Math.min((this.scrollPosition - 70) * 0.5, 100);
      this.firstPTransform = `translateX(-${translateDistance}px)`;
      this.secondPTransform = `translateX(${translateDistance}px)`;
    } else {
      this.firstPOpacity = 1;
      this.secondPOpacity = 1;
      this.firstPTransform = 'translateX(0)';
      this.secondPTransform = 'translateX(0)';
    }
    if (this.scrollPosition > 35) {
      const opacity = Math.max(1 - (this.scrollPosition - 50) / 100, 0);
      this.h1Opacity = opacity;
    } else {
      this.h1Opacity = 1;
    }

    console.log('Position de défilement actuelle:', this.scrollPosition);
  }
}
