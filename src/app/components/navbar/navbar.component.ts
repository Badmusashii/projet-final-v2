import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleService } from 'src/app/services/toggleservice.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  toggles: { [key: number]: boolean } = {};
  private togglesSubscription: Subscription | undefined;

  constructor(private toggleService: ToggleService) {}

  ngOnInit(): void {
    this.togglesSubscription = this.toggleService.toggles$.subscribe(
      (toggles) => {
        this.toggles = toggles;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.togglesSubscription) {
      this.togglesSubscription.unsubscribe();
    }
  }

  onClick(event: Event) {
    console.log(this.toggles);
  }
}
