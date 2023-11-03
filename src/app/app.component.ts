import { Component, Renderer2 } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private authService: AuthServiceService,
    private renderer: Renderer2
  ) {
    this.authService.authStatusChanged.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.renderer.addClass(document.body, 'authenticated');
        this.renderer.removeClass(document.body, 'unauthenticated');
      } else {
        this.renderer.removeClass(document.body, 'authenticated');
        this.renderer.addClass(document.body, 'unauthenticated');
      }
    });
  }
  title = 'projet-final-v2';
}
