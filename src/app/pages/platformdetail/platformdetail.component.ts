import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, ActiveToast } from 'ngx-toastr';
import { GetplatformsService } from 'src/app/services/getplatforms.service';
import { MediaService } from 'src/app/services/mediaservice.service';
import { ToastCustomComponent } from 'src/app/components/toast-custom/toast-custom.component';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-platformdetail',
  templateUrl: './platformdetail.component.html',
  styleUrls: ['./platformdetail.component.css'],
})
export class PlatformdetailComponent implements OnInit {
  @ViewChild('floatingImage') floatingImage: ElementRef | undefined;
  h1Title: string = '';
  platform: any;
  platformId!: number;
  mediaTitle: string = '';
  mediaList: any[] = [];
  isHovered = false;
  showAsCard: boolean = false;
  responseData!: any;
  cardData: any[] = [];
  private searchTerms = new Subject<string>();
  currentToast: ActiveToast<any> | null = null;
  toastId!: number;
  wichApi: string = 'local';
  posterUrl: string | null = null;
  lastX = 0;
  lastY = 0;
  lastTime = Date.now();
  showButton = true;

  constructor(
    private route: ActivatedRoute,
    private platformService: GetplatformsService,
    private mediaService: MediaService,
    private toast: ToastrService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.platformId = Number(this.route.snapshot.paramMap.get('id'));
    // this.platform = this.platformService.getPlatform(id);
    if (id !== null) {
      this.platformService.getPlatform(Number(id)).subscribe((platform) => {
        this.platform = platform;
        // console.log(this.platform);
        this.h1Title = `La collection ${
          this.platform ? this.platform.name : ''
        }`;
      });
    }
    if (this.wichApi === 'local') {
      this.searchTerms
        .pipe(
          // Attends un peu avant d'émettre une nouvelle valeur
          debounceTime(300),

          // Pour chaque terme de recherche, effectue une recherche
          switchMap((term: string) =>
            this.mediaService.searchMediaByTitle(term, this.platform.id)
          )
        )
        .subscribe((response) => {
          // Traite la réponse ici
          this.handleSearchResponse(response);
        });
    }

    // this.mediaService
    //   .getAllMediaByPlatformAndUser(id)
    //   .subscribe((mediaWithPlatforms) => {
    //     this.mediaList = mediaWithPlatforms;
    //   });
    this.loadMediaList(id);
    
  }
  @HostListener('document:mousemove', ['$event'])
  // onMouseMove(e: MouseEvent) {
  //   console.log(e.clientY);
  //   if (this.floatingImage && this.floatingImage.nativeElement) {
  //     const image = this.floatingImage.nativeElement as HTMLElement;
  //     const imageHeight = image.offsetHeight;
  //     const scrollTop =
  //       window.scrollY ||
  //       document.documentElement.scrollTop ||
  //       document.body.scrollTop ||
  //       0;

  //     let topPosition;

  //     // Si le curseur est dans le haut de l'écran, positionnez l'image différemment
  //     if (e.clientY < window.innerHeight / 2) {
  //       topPosition = e.clientY; // Positionnez l'image en dessous du curseur
  //       if (scrollTop > 100) {
  //         // Vous pouvez ajuster ce nombre en fonction de vos besoins
  //         topPosition += scrollTop;
  //       }
  //     } else {
  //       topPosition = e.pageY - imageHeight; // Positionnez l'image au-dessus du curseur
  //     }

  //     image.style.left = e.pageX + 'px';
  //     image.style.top = topPosition - scrollTop + 'px';
  //   }
  //   console.log(this.posterUrl);
  // }
  onMouseMove(e: MouseEvent) {
    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastTime;
    const xDiff = e.clientX - this.lastX;
    const yDiff = e.clientY - this.lastY;

    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    let speed = timeDiff > 0 ? distance / timeDiff : 0;

    console.log('speed => ', speed);
    if (speed > 0.2) {
      this.posterUrl = null;
    }
    if (this.floatingImage && this.floatingImage.nativeElement) {
      const image = this.floatingImage.nativeElement as HTMLElement;
      const imageHeight = image.offsetHeight;
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      let topPosition;

      // Si le curseur est dans le haut de l'écran, positionnez l'image différemment
      if (e.clientY < window.innerHeight / 2) {
        topPosition = e.clientY; // Positionnez l'image en dessous du curseur
        if (scrollTop > 100) {
          // Vous pouvez ajuster ce nombre en fonction de vos besoins
          topPosition += scrollTop;
        }
      } else {
        topPosition = e.pageY - imageHeight; // Positionnez l'image au-dessus du curseur
      }

      image.style.left = e.pageX + 'px';
      image.style.top = topPosition - scrollTop + 'px';
    }
    console.log(this.posterUrl);
  }

  loadMediaList(id: number): void {
    const platformId = id;
    console.log('Chargement de la liste des médias pour la plateforme ID:', id);

    this.mediaService
      .getAllMediaByPlatformAndUser(platformId)
      .subscribe((mediaWithPlatforms) => {
        console.log('Données reçues:', mediaWithPlatforms);

        // this.mediaList = mediaWithPlatforms;
        this.mediaList = mediaWithPlatforms.sort((a, b) => {
          // Assurez-vous que les titres existent pour éviter les erreurs
          if (a.title && b.title) {
            return a.title.localeCompare(b.title);
          }
          return 0;
        });
      });
  }

  // toggleHover(media: { isHovered: boolean }, value: boolean) {
  //   media.isHovered = value;
  // }
  toggleHover(
    media: { isHovered: boolean; hoverColor?: string },
    value: boolean,
    color: string
  ) {
    media.isHovered = value;
    media.hoverColor = color;
  }
  onSearch(term: string): void {
    this.searchTerms.next(term);
    this.sortMediaList();
  }
  private handleSearchResponse(response: any): void {
    if (response.source === 'local') {
      this.mediaList = response.data;
      this.sortMediaList();
      this.showAsCard = false;
    } else if (response.source === 'giantbomb') {
      this.wichApi = 'giantbomb';
      this.h1Title = `Introuvable dans cette collection`;
      if (!this.currentToast) {
        this.currentToast = this.toast.info(
          `Choisissez un titre à ajouter à la collection ${this.platform.name}`,
          'Information',
          {
            closeButton: true, // Permet d'afficher un bouton pour fermer le toast
            timeOut: 0, // Désactive le délai avant la fermeture automatique
            extendedTimeOut: 0, // Désactive le délai supplémentaire après le survol
            tapToDismiss: false, // Désactive la fermeture du toast au clic sur celui-ci
          }
        );
      }

      this.showAsCard = true;
      this.responseData = response.data;
      console.log('ma data cree ' + JSON.stringify(this.responseData));
      if (this.platformId === 17) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'Nintendo Switch'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 4) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'PlayStation'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 5) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'PlayStation 2'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 6) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'PlayStation 3'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 7) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'PlayStation 4'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 8) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'PlayStation 5'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 9) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'PlayStation Portable'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 10) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'PlayStation Vita'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 11) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'Nintendo Entertainment System'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 12) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'Super Nintendo Entertainment System'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 13) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Nintendo 64'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 14) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'GameCube'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 15) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Wii'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 16) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Wii U'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 18) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Game Boy'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 19) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'Game Boy Advance'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 20) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Nintendo DS'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 21) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Nintendo 3DS'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 22) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Xbox'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 23) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Xbox 360'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 24) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Xbox One'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 25) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'Xbox Series X|S'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 26) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) =>
                platform.name === 'Sega Master System'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 27) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Genesis'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 28) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Sega CD'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 29) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Sega 32X'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 30) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Saturn'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 31) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Dreamcast'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 32) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Game Gear'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 33) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Atari Lynx'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      } else if (this.platformId === 34) {
        const filteredGames = this.responseData.results.filter(
          (game: { platforms: { name: string }[] }) =>
            game.platforms?.some(
              (platform: { name: string }) => platform.name === 'Jaguar'
            )
        );
        this.cardData = this.transformGamesToCardData(filteredGames);
      }
    } else if (response.source === 'tmbd') {
      this.wichApi = 'tmdb';
      this.h1Title = `Introuvable dans cette collection`;
      if (!this.currentToast) {
        this.currentToast = this.toast.info(
          `Choisissez un titre à ajouter à la collection ${this.platform.name}`,
          'Information',
          {
            closeButton: false, // Permet d'afficher un bouton pour fermer le toast
            timeOut: 0, // Désactive le délai avant la fermeture automatique
            extendedTimeOut: 0, // Désactive le délai supplémentaire après le survol
            tapToDismiss: true, // Désactive la fermeture du toast au clic sur celui-ci
          }
        );
      }
      this.toastId = this.currentToast.toastId;
      console.log("l'id du toast est ", this.toastId);
      // this.mediaList = [];
      this.showAsCard = true;
      this.responseData = response.data;
      console.log(this.responseData);
      // Trie les films par date de sortie, du plus récent au plus ancien
      this.responseData.results.sort(
        (
          a: { release_date: string | number | Date },
          b: { release_date: string | number | Date }
        ) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateB.getTime() - dateA.getTime();
        }
      );
      this.cardData = this.transformMoviesToCardData(this.responseData.results);
    }
  }

  // onSearch(searchText: string) {
  //   if (!searchText) {
  //     console.warn('Le texte de recherche est vide ou non défini.');
  //     return;
  //   }
  //   this.searchTerms.next(searchText);
  //   // Désinfection du champ de recherche
  //   const sanitizedSearchText = searchText.replace(/[^a-zA-Z0-9 ]/g, '');
  //   const platformId = this.platform.id;
  //   console.log('input desinfecté ' + sanitizedSearchText);
  //   this.mediaService
  //     .searchMediaByTitle(sanitizedSearchText, platformId)
  //     .subscribe((response) => {
  //       if (response.source === 'local') {
  //         this.mediaList = response.data;
  //         this.showAsCard = false;
  //         this.mediaList = [];
  //       } else if (response.source === 'giantbomb') {
  //         this.showAsCard = true;
  //         this.responseData = response.data;
  //         console.log('ma data cree ' + JSON.stringify(this.responseData));
  //         if (platformId === 17) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Nintendo Switch'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 4) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'PlayStation'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 5) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'PlayStation 2'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 6) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'PlayStation 3'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 7) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'PlayStation 4'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 8) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'PlayStation 5'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 9) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'PlayStation Portable'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 10) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'PlayStation Vita'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 11) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Nintendo Entertainment System'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 12) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Super Nintendo Entertainment System'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 13) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Nintendo 64'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 14) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'GameCube'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 15) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Wii'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 16) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Wii U'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 18) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Game Boy'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 19) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Game Boy Advance'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 20) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Nintendo DS'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 21) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Nintendo 3DS'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 22) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Xbox'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 23) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Xbox 360'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 24) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Xbox One'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 25) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Xbox Series X|S'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 26) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) =>
  //                   platform.name === 'Sega Master System'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 27) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Genesis'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 28) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Sega CD'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 29) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Sega 32X'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 30) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Saturn'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 31) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Dreamcast'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 32) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Game Gear'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 33) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Atari Lynx'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         } else if (platformId === 34) {
  //           const filteredGames = this.responseData.results.filter(
  //             (game: { platforms: { name: string }[] }) =>
  //               game.platforms?.some(
  //                 (platform: { name: string }) => platform.name === 'Jaguar'
  //               )
  //           );
  //           this.cardData = this.transformGamesToCardData(filteredGames);
  //         }
  //       } else if (response.source === 'tmbd') {
  //         // this.mediaList = [];
  //         this.showAsCard = true;
  //         this.responseData = response.data;
  //         console.log(this.responseData);
  //         // Trie les films par date de sortie, du plus récent au plus ancien
  //         this.responseData.results.sort(
  //           (
  //             a: { release_date: string | number | Date },
  //             b: { release_date: string | number | Date }
  //           ) => {
  //             const dateA = new Date(a.release_date);
  //             const dateB = new Date(b.release_date);
  //             return dateB.getTime() - dateA.getTime();
  //           }
  //         );
  //         this.cardData = this.transformMoviesToCardData(
  //           this.responseData.results
  //         );
  //       }
  //       console.log('la data des cartes ' + JSON.stringify(this.cardData));
  //     });
  // }

  handleMediaAdded(event: { status: string; title: string }) {
    if (event.status === 'ok') {
      console.log('ok recu coté parent');
      setTimeout(() => {
        this.loadMediaList(this.platform.id);
        const titleUppercase = event.title.toUpperCase();
        this.toast.success(`Ajout de ${titleUppercase}`, `en cours`, {
          progressBar: true, // montre une barre de progression
          timeOut: 4000, // défini la durée d'affichage à 5 secondes
          extendedTimeOut: 1000,
          closeButton: true, // ajoute un bouton de fermeture
          toastClass: 'my-toast-class',
        });
        // this.toast.show('', '', {
        //   toastComponent: ToastCustomComponent,
        //   progressBar: true,
        //   onActivateTick: true,
        // });
      }, 1000);
    }
  }

  transformGamesToCardData(games: any[]): any[] {
    return games.map(
      (game: {
        name: any;
        original_release_date: any;
        // image: { medium_url: any };
        image: { original_url: any };
        deck: any;
        guid: any;
      }) => ({
        title: game.name,
        releaseDate: game.original_release_date,
        // imageUrl: game.image.medium_url,
        imageUrl: game.image.original_url,
        description: game.deck,
        guid: game.guid,
      })
    );
  }

  // transformMoviesToCardData(movies: any[]): any[] {
  //   return movies.map(
  //     (movie: {
  //       title: string;
  //       release_date: string;
  //       poster_path: string;
  //       overview: string;
  //       id: number;
  //     }) => ({
  //       title: movie.title,
  //       releaseDate: movie.release_date,
  //       imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  //       description: movie.overview,
  //       id: movie.id,
  //     })
  //   );
  // }
  transformMoviesToCardData(movies: any[]): any[] {
    return movies
      .filter(
        (movie: { poster_path: string | null }) => movie.poster_path !== null
      )
      .map(
        (movie: {
          title: string;
          release_date: string;
          poster_path: string;
          overview: string;
          id: number;
        }) => ({
          title: movie.title,
          releaseDate: movie.release_date,
          imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          description: movie.overview,
          guid: movie.id,
        })
      );
  }

  onAddMedia() {
    // Ici, envoyez les données du formulaire à votre serveur
    const newMedia = {
      title: this.mediaTitle,
      // Ajoutez d'autres propriétés ici
    };

    this.platformService
      .addMediaToPlatform(this.platform.id, newMedia)
      .subscribe((response) => {
        console.log('Média ajouté avec succès!', response);
        // Peut-être mettre à jour la liste des médias de cette plateforme
        // this.loadMediaList(this.platform.id);
        this.mediaList.push(response);
        console.log('medialist => ' + this.mediaList);
      });
  }
  modifier(id: string) {
    console.log('Modifier l’élément avec l’ID:', id);
    // Insère ici le code pour modifier l'élément
  }

  supprimer(mediaId: string) {
    this.mediaService.removeMediaRelation(+mediaId).subscribe((response) => {
      console.log(response),
        this.toast.success('Media supprime avec succes.', 'Succes', {
          progressBar: true,
          timeOut: 3000,
          toastClass: 'my-toast-class',
        });
      (err: any) => {
        console.log(err);
        this.toast.error('Erreur lors de la suppression du média.', 'Erreur', {
          progressBar: true,
          timeOut: 3000,
        });
      };
      this.loadMediaList(this.platform.id);
      // Mettre à jour la liste des médias ou tout autre traitement nécessaire.
    });
  }
  showGuid(guid: string) {
    if (
      this.platformId !== 1 &&
      this.platformId !== 2 &&
      this.platformId !== 3
    ) {
      this.router.navigate(['/gameInfo'], { queryParams: { guid: guid } });
    } else {
      this.router.navigate(['/movieInfo', guid]);
    }
  }
  // pushMedia(cardData: any, platformId: number) {
  //   this.mediaService.searchMediaByTitle(cardData.title, platformId).subscribe({
  //   next: (response) => {
  //     if (response.source === 'local') {
  //       // Le titre est déjà dans la base de données
  //       this.toast.info(`Le média "${cardData.title}" a déjà été ajouté.`, 'Information', {
  //         progressBar: true,
  //         timeOut: 3000,
  //       });
  //     } else {
  //   let requestBody;
  //   // console.log(cardData);

  //   const year = cardData.releaseDate.split('-')[0];
  //   console.log(typeof +year);
  //   requestBody = {
  //     title: cardData.title,
  //     yearofrelease: +year,
  //     idapi: cardData.guid,
  //   };
  //   this.mediaService.addMediaToUserAndPlatform(platformId, requestBody);

  //   // console.log(requestBody);
  // }
  //   });}
  pushMedia(cardData: any, platformId: number) {
    this.mediaService.searchMediaByTitle(cardData.title, platformId).subscribe({
      next: (response) => {
        if (response.source === 'local') {
          // Le titre est déjà dans la base de données
          this.toast.info(
            `Le média "${cardData.title}" est deja dans ta collection`,
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
          const year = cardData.releaseDate.split('-')[0];
          const title = this.replaceSpecialChars(cardData.title.toLowerCase());
          requestBody = {
            title: title,
            yearofrelease: +year,
            idapi: cardData.guid,
          };
          this.mediaService.addMediaToUserAndPlatform(platformId, requestBody);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la recherche du média:', err);
        // Gérer les erreurs de recherche ici
      },
    });
  }
  goBack(): void {
    this.location.back();
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
  closeToast() {
    if (this.currentToast) {
      console.log(this.currentToast);
      this.toast.clear(this.currentToast.toastId);
    }
  }
  sortMediaList(): void {
    this.mediaList = this.mediaList.sort((a, b) => {
      if (a.title && b.title) {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }
  // async showPoster(idApi: string) {
  //   try {
  //     const posterData = await this.mediaService
  //       .getMoviePoster(idApi)
  //       .toPromise();
  //     this.posterUrl = posterData.poster_path;
  //     console.log(this.posterUrl);
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération du poster', error);
  //   }
  // }
  async showPoster(idApi: string) {
    this.mediaService.getMoviePoster(idApi, this.platformId).subscribe(
      (posterPath) => {
        this.posterUrl = posterPath;
      },
      (error) => {
        console.error('Erreur lors de la récupération du poster', error);
      }
    );
  }
  hidePoster() {
    this.posterUrl = null;
  }
  redirectTo(id: string) {
    console.log(id);
    if (id.includes('-')) {
      this.router.navigateByUrl(`/gameInfo?guid=${id}&nobutton=true`);
    } else {
      this.router.navigateByUrl(`/movieInfo/${id}?nobutton=true`);
    }
  }
}
