import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from 'src/app/services/mediaservice.service';
import { GameInfo } from 'src/app/components/models/game-info';
import { gameInfoApiResponse } from 'src/app/components/models/game-info-api-response';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css'],
})
export class GameInfoComponent implements OnInit {
  gameDetails!: GameInfo;
  isLoading: boolean = true;
  additionalImages: any[] = [];
  showButton = true;
  Invisible: boolean = false;
  platformId!: number;
  guid!: string;

  constructor(
    private mediaService: MediaService,
    private activatedRoute: ActivatedRoute,
    private sanitazer: DomSanitizer,
    private location: Location,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.platformId = +this.activatedRoute.snapshot.queryParams['platformId'];
    console.log(this.platformId);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.guid = params['guid'];
      if (this.guid) {
        this.GameDetails(this.guid);
      }
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['nobutton']) {
        this.showButton = false;
      }
    });
  }
  GameDetails(guid: string) {
    this.mediaService.getGameInfoByGuid(guid).subscribe(
      (data: gameInfoApiResponse) => {
        this.gameDetails = data.results;
        this.isLoading = false;
        console.log('les infos detaille ' + JSON.stringify(this.gameDetails));
        this.getAdditionalImages(guid);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des détails du jeu:',
          error
        );
      }
    );
  }
  getAdditionalImages(guid: string) {
    this.mediaService.getAdditionalImages(guid).subscribe(
      (data: any) => {
        this.additionalImages = data.map((url: string) => ({
          url: this.sanitazer.bypassSecurityTrustUrl(url),
        }));
        console.log('Images supplémentaires: ', this.additionalImages);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des images supplémentaires:',
          error
        );
      }
    );
  }
  getSafeHtml(html: string): SafeHtml {
    return this.sanitazer.bypassSecurityTrustHtml(html);
  }
  goBack(): void {
    this.location.back();
  }
  pushMedia(gameDetails: any, platformId: number) {
    console.log(gameDetails);
    console.log(gameDetails.name);
    console.log(gameDetails.original_release_date);
    this.mediaService
      .searchMediaByTitle(gameDetails.name, platformId)
      .subscribe({
        next: (response) => {
          if (response.source === 'local') {
            // Le titre est déjà dans la base de données
            this.toast.info(
              `Le média "${gameDetails.name}" est deja dans ta collection`,
              'Information',
              {
                progressBar: true,
                timeOut: 3000,
                toastClass: 'my-toast-class',
              }
            );
          } else {
            // Si le titre n'est pas trouvé dans la base de données, procéder à l'ajout
            let requestBody;
            const year = gameDetails.original_release_date.split('-')[0];
            const title = this.replaceSpecialChars(
              gameDetails.name.toLowerCase()
            );
            console.log(this.guid);
            requestBody = {
              title: title,
              yearofrelease: +year,
              idapi: this.guid,
            };

            this.mediaService.addMediaToUserAndPlatform(
              +platformId,
              requestBody
            );
            this.Invisible = true;
          }
        },
        error: (err) => {
          console.error('Erreur lors de la recherche du média:', err);
          // Gérer les erreurs de recherche ici
        },
      });
  }
  replaceSpecialChars(str: string): string {
    return str
      .replace(/é|è|ê|ë/g, 'e')
      .replace(/à|â|ä/g, 'a')
      .replace(/ç/g, 'c')
      .replace(/ô|ö/g, 'o')
      .replace(/î|ï/g, 'i')
      .replace(/û|ü/g, 'u');
  }
}
