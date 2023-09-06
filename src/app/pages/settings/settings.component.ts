import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  GetplatformsService,
  Platform,
} from 'src/app/services/getplatforms.service';
import { ToggleService } from 'src/app/services/toggleservice.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  platforms: Platform[] = [];
  toggles: { [key: number]: boolean } = {};

  constructor(
    private platformsService: GetplatformsService,
    private toggleService: ToggleService
  ) {}

  // ngOnInit(): void {
  //   // Abonnez-vous aux mises à jour du service
  //   this.toggleService.toggles$.subscribe((toggles) => {
  //     this.toggles = toggles;
  //   });

  //   this.platformsService.getPlatforms().subscribe((data) => {
  //     this.platforms = data;

  //     // Initialisez les valeurs de bascule pour chaque plateforme
  //     for (const platform of this.platforms) {
  //       this.toggles[platform.id] = false;
  //     }

  //     // Mettez à jour le service avec les valeurs initiales
  //     this.toggleService.initializeToggles(this.toggles);
  //   });
  // }

  // ngOnInit(): void {
  //   this.platformsService.getPlatforms().subscribe((data) => {
  //     this.platforms = data;

  //     // Initialisez les valeurs de bascule pour chaque plateforme
  //     for (const platform of this.platforms) {
  //       this.toggles[platform.id] = false;
  //     }

  //     // Mettez à jour le service avec les valeurs initiales
  //     this.toggleService.initializeToggles(this.toggles);
  //   });

  //   // Abonnez-vous aux mises à jour du service
  //   this.toggleService.toggles$.subscribe((toggles) => {
  //     this.toggles = toggles;
  //   });
  // }

  // ngOnInit(): void {
  //   // Abonnez-vous aux mises à jour du service
  //   this.toggleService.toggles$.subscribe((toggles) => {
  //     this.toggles = { ...toggles }; // Clonez les valeurs existantes
  //   });

  //   this.platformsService.getPlatforms().subscribe((data) => {
  //     this.platforms = data;

  //     // Initialisez les valeurs de bascule pour chaque plateforme
  //     for (const platform of this.platforms) {
  //       if (this.toggles[platform.id] === undefined) {
  //         // Si la valeur de bascule pour cette plateforme n'a pas encore été définie, initialisez-la à false
  //         this.toggles[platform.id] = false;
  //       }
  //     }

  //     // Mettez à jour le service avec les valeurs
  //     this.toggleService.initializeToggles(this.toggles);
  //   });

  //   console.log(this.toggles);
  // }

  // ngOnInit(): void {
  //   this.platformsService.getPlatforms().subscribe((data) => {
  //     this.platforms = data;

  //     this.toggles = this.toggleService.getCurrentToggles();

  //     for (const platform of this.platforms) {
  //       // this.toggles[platform.id] = false;
  //       if (this.toggles[platform.id] === undefined) {
  //         this.toggles[platform.id] = false;
  //       }
  //     }

  //     this.toggleService.initializeToggles(this.toggles);

  //     this.toggleService.toggles$.subscribe((toggles) => {
  //       this.toggles = toggles; // Clonez les valeurs existantes
  //       console.log('valeur dans le behavior', toggles);
  //     });

  //     const currentToggles = this.toggleService.getCurrentToggles();

  //     console.log(this.toggles);
  //   });
  // }

  // ngOnInit(): void {
  //   this.platformsService.getPlatforms().subscribe((data) => {
  //     this.platforms = data;

  //     // Obtenez les valeurs actuelles des bascules
  //     this.toggles = this.toggleService.getCurrentToggles();

  //     // Pour chaque plateforme, si elle n'a pas de valeur de bascule définie, initialiser à false
  //     let isTogglesUpdated = false;
  //     for (const platform of this.platforms) {
  //       if (this.toggles[platform.id] === undefined) {
  //         this.toggles[platform.id] = false;
  //         isTogglesUpdated = true;
  //       }
  //     }

  //     // Si nous avons dû ajouter de nouvelles valeurs de bascule, alors mettez à jour le BehaviorSubject
  //     if (isTogglesUpdated) {
  //       this.toggleService.initializeToggles(this.toggles);
  //     }

  //     // Abonnez-vous aux mises à jour du BehaviorSubject
  //     this.toggleService.toggles$.subscribe((toggles) => {
  //       this.toggles = toggles;
  //     });
  //   });
  // }

  ngOnInit(): void {
    const userId = this.platformsService.getPlatforms().subscribe((data) => {
      this.platforms = data;

      // this.toggles = this.toggleService.getCurrentToggles();

      // for (const platform of this.platforms) {
      //   if (this.toggles[platform.id] === undefined) {
      //     this.toggles[platform.id] = false;
      //   }
      // }

      this.toggleService.toggles$.subscribe((toggles) => {
        this.toggles = toggles;
      });
    });
  }

  handleToggle(platformId: number) {
    // Inversez la valeur de la bascule et mettez à jour le service
    this.toggles[platformId] = !this.toggles[platformId];
    // this.toggleService.toggle(platformId, this.toggles[platformId]);
    this.toggleService.updateToggle(platformId, this.toggles[platformId]);
    // console.log(this.toggles);
  }
  ngOnDestroy(): void {
    const togglesStates = this.toggleService.getCurrentToggles();
    this.toggleService.savePlatformStates(togglesStates).subscribe(
      (response) => {
        console.log(
          'Les états des toggles ont bien été sauvegarder' + response
        );
      },
      (err) => {
        console.error(
          'Erreur lors de la sauvegarde des états',
          err.message,
          "Détails de l'erreur:",
          JSON.stringify(err, null, 2)
        );
      }
    );
  }
}
