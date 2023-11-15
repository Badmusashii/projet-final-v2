import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css'],
})
export class NotfoundComponent {
  imageNumber!: number;

  constructor(private router: Router) {
    this.imageNumber = this.getRandomNumber();
  }
  getRandomNumber(): number {
    return Math.floor(Math.random() * 7) + 1;
  }
  redirectToHome(): void {
    this.router.navigate(['']);
  }
}
