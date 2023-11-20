import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from 'src/app/services/mediaservice.service';
import { GameInfo } from 'src/app/components/models/game-info';
import { gameInfoApiResponse } from 'src/app/components/models/game-info-api-response';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';

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

  constructor(
    private mediaService: MediaService,
    private activatedRoute: ActivatedRoute,
    private sanitazer: DomSanitizer,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const guid = params['guid'];
      if (guid) {
        this.GameDetails(guid);
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
}
