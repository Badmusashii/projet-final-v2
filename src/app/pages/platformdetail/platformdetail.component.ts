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
        } else if (response.source === 'giantbomb') {
          this.mediaList = [];
          this.showAsCard = true;
          this.responseData = response.data;
          console.log('ma data cree ' + JSON.stringify(this.responseData));
          const nintendoSwitchGames = this.responseData.results.filter(
            (game: { platforms: { name: string }[] }) =>
              game.platforms.some(
                (platform: { name: string }) =>
                  platform.name === 'Nintendo Switch'
              )
          );
          console.log('nin game ' + nintendoSwitchGames);
          this.cardData = nintendoSwitchGames.map(
            (game: {
              name: any;
              original_release_date: any;
              image: { medium_url: any };
              deck: any;
            }) => ({
              title: game.name,
              releaseDate: game.original_release_date,
              imageUrl: game.image.medium_url,
              description: game.deck,
            })
          );
        } else if (response.source === 'tmdb') {
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
