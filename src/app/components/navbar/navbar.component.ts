import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleService } from 'src/app/services/toggleservice.service';
import { AnimationSyncService } from 'src/app/services/anim-syncro.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  toggles: { [key: number]: boolean } = {};
  private togglesSubscription: Subscription | undefined;

  constructor(
    private toggleService: ToggleService,
    private animSyncro: AnimationSyncService
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
  // ngOnDestroy(): void {}
}
