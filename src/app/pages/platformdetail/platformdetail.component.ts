import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GetplatformsService } from 'src/app/services/getplatforms.service';
import { MediaService } from 'src/app/services/mediaservice.service';
import { ToastCustomComponent } from 'src/app/components/toast-custom/toast-custom.component';

@Component({
  selector: 'app-platformdetail',
  templateUrl: './platformdetail.component.html',
  styleUrls: ['./platformdetail.component.css'],
})
export class PlatformdetailComponent implements OnInit {
  platform: any;
  mediaTitle: string = '';
  mediaList: any[] = [];
  isHovered = false;
  showAsCard: boolean = false;
  responseData!: any;
  cardData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private platformService: GetplatformsService,
    private mediaService: MediaService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // this.platform = this.platformService.getPlatform(id);
    if (id !== null) {
      this.platformService.getPlatform(Number(id)).subscribe((platform) => {
        this.platform = platform;
      });
    }

    // this.mediaService
    //   .getAllMediaByPlatformAndUser(id)
    //   .subscribe((mediaWithPlatforms) => {
    //     this.mediaList = mediaWithPlatforms;
    //   });
    this.loadMediaList(id);
  }

  loadMediaList(id: number): void {
    const platformId = id;
    console.log('Chargement de la liste des médias pour la plateforme ID:', id);

    this.mediaService
      .getAllMediaByPlatformAndUser(platformId)
      .subscribe((mediaWithPlatforms) => {
        console.log('Données reçues:', mediaWithPlatforms);

        this.mediaList = mediaWithPlatforms;
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

  onSearch(searchText: string) {
    if (!searchText) {
      console.warn('Le texte de recherche est vide ou non défini.');
      return;
    }
    // Désinfection du champ de recherche
    const sanitizedSearchText = searchText.replace(/[^a-zA-Z0-9 ]/g, '');
    const platformId = this.platform.id;
    console.log('inpur desinfecté ' + sanitizedSearchText);
    this.mediaService
      .searchMediaByTitle(sanitizedSearchText, platformId)
      .subscribe((response) => {
        if (response.source === 'local') {
          this.mediaList = response.data;
          this.showAsCard = false;
          this.mediaList = [];
        } else if (response.source === 'giantbomb') {
          this.showAsCard = true;
          this.responseData = response.data;
          console.log('ma data cree ' + JSON.stringify(this.responseData));
          if (platformId === 17) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Nintendo Switch'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 4) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'PlayStation'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 5) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'PlayStation 2'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 6) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'PlayStation 3'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 7) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'PlayStation 4'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 8) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'PlayStation 5'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 9) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'PlayStation Portable'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 10) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'PlayStation Vita'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 11) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Nintendo Entertainment System'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 12) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Super Nintendo Entertainment System'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 13) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Nintendo 64'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 14) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'GameCube'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 15) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Wii'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 16) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Wii U'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 18) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Game Boy'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 19) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Game Boy Advance'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 20) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Nintendo DS'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 21) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Nintendo 3DS'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 22) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Xbox'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 23) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Xbox 360'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 24) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Xbox One'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 25) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Xbox Series X|S'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 26) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) =>
                    platform.name === 'Sega Master System'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 27) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Genesis'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 28) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Sega CD'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 29) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Sega 32X'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 30) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Saturn'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 31) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Dreamcast'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 32) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Game Gear'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 33) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Atari Lynx'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          } else if (platformId === 34) {
            const filteredGames = this.responseData.results.filter(
              (game: { platforms: { name: string }[] }) =>
                game.platforms?.some(
                  (platform: { name: string }) => platform.name === 'Jaguar'
                )
            );
            this.cardData = this.transformGamesToCardData(filteredGames);
          }
        } else if (response.source === 'tmbd') {
          // this.mediaList = [];
          this.showAsCard = true;
          this.responseData = response.data;
          const filteredMovies = this.responseData.data.results.map(
            (movie: any) => ({
              title: movie.original_title,
              release_date: movie.release_date,
              genres: movie.genre_ids, // Vous pourriez faire une transformation supplémentaire pour convertir les IDs de genres en noms de genres si vous avez cette information
              overview: movie.overview,
              vote_average: movie.vote_average,
              poster_path: movie.poster_path,
            })
          );

          this.cardData = this.transformGamesToCardData(filteredMovies);
        }
        console.log('la data des cartes ' + this.cardData);
      });
  }

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
      }) => ({
        title: game.name,
        releaseDate: game.original_release_date,
        // imageUrl: game.image.medium_url,
        imageUrl: game.image.original_url,
        description: game.deck,
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
        (err: any) => {
          console.log(err);
        };
      this.loadMediaList(this.platform.id);
      // Mettre à jour la liste des médias ou tout autre traitement nécessaire.
    });
  }
}
