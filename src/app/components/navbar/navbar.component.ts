import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleService } from 'src/app/services/toggleservice.service';
import { AnimationSyncService } from 'src/app/services/anim-syncro.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  showSideMenu = false;
  toggles: { [key: number]: boolean } = {};
  private togglesSubscription: Subscription | undefined;
  isAuthenticated: boolean = false;
  private authSubscription: Subscription | undefined;
  @ViewChild('sideMenu') sideMenu: ElementRef | undefined;

  constructor(
    private toggleService: ToggleService,
    private animSyncro: AnimationSyncService,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.animSyncro.syncEvent.subscribe(() => {
      // Code pour synchroniser la navbar ici
      this.syncNavbar();
    });
    this.togglesSubscription = this.toggleService.toggles$.subscribe(
      (toggles) => {
        this.toggles = toggles;
      }
    );
    this.authSubscription = this.authService.isAuthenticated.subscribe(
      (authStatus) => {
        this.isAuthenticated = authStatus;
      }
    );
    this.toggleService.fetchAndSetTogglesForUser();
  }

  ngOnDestroy(): void {
    if (this.togglesSubscription) {
      this.togglesSubscription.unsubscribe();
    }
    this.animSyncro.syncEvent.unsubscribe();
  }

  onClick(event: Event) {
    console.log(this.toggles);
    this.toggleSideMenu();
  }
  syncNavbar() {
    // Ici, ajoutez le code qui doit être exécuté pour synchroniser la navbar.
    // Par exemple, vous pouvez ajouter ou retirer des classes CSS pour lancer ou arrêter des animations.
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (navbar.classList.contains('breathe')) {
      navbar.classList.remove('breathe');
    } else {
      navbar.classList.add('breathe');
    }
  }
  toggleSideMenu() {
    this.showSideMenu = !this.showSideMenu;
  }
  deconnexion() {
    console.log('log logf log');
    this.authService.logout().subscribe(() => {
      // Actions après la déconnexion, par exemple rediriger vers la page de connexion
    });
    localStorage.removeItem('token'); // Supprime le token du localStorage
    this.cookieService.delete('refreshToken', '/'); // Supprime le refreshToken des cookies

    // Rediriger l'utilisateur vers la page de connexion ou effectuer d'autres actions nécessaires après la déconnexion
  }
  closeSideMenu(event: MouseEvent) {
    if (this.sideMenu && this.sideMenu.nativeElement) {
      if (!this.sideMenu.nativeElement.contains(event.relatedTarget)) {
        this.showSideMenu = false;
      }
    }
  }
  // ngOnDestroy(): void {}
}
