import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthServiceService,
    private renderer: Renderer2,
    private router: Router
  ) {}
  ngOnInit(): void {
    // this.setBodyClassBasedOnAuthStatus();
    // this.authService.authStatusChanged.subscribe((isAuthenticated) => {
    //   this.setBodyClassBasedOnAuthStatus();
    //   if (!isAuthenticated && this.router.url !== '/login') {
    //     this.router.navigate(['/login']);
    //   }
    // });
    // this.authService.authStatusChanged.subscribe((isAuthenticated) => {
    //   this.setBodyClassBasedOnAuthStatus(isAuthenticated);
    //   if (!isAuthenticated && this.router.url !== '/login') {
    //     this.router.navigate(['/login']);
    //   }
    // });
    this.authService.initAuth().then(() => {
      this.authService.authStatusChanged.subscribe((isAuthenticated) => {
        this.setBodyClassBasedOnAuthStatus(isAuthenticated);
        // Redirection seulement si on n'est pas déjà sur la page de login
        if (!isAuthenticated && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      });
    });
  }
  setBodyClassBasedOnAuthStatus(isAuthenticated: boolean) {
    // this.authService.isAuthenticated.subscribe((isAuthenticated) => {
    //   if (isAuthenticated) {
    //     this.renderer.addClass(document.body, 'authenticated');
    //     this.renderer.removeClass(document.body, 'unauthenticated');
    //   } else {
    //     this.renderer.removeClass(document.body, 'authenticated');
    //     this.renderer.addClass(document.body, 'unauthenticated');
    //   }
    // });
    if (isAuthenticated) {
      this.renderer.addClass(document.body, 'authenticated');
      this.renderer.removeClass(document.body, 'unauthenticated');
    } else {
      this.renderer.removeClass(document.body, 'authenticated');
      this.renderer.addClass(document.body, 'unauthenticated');
    }
  }
  title = 'projet-final-v2';
}
