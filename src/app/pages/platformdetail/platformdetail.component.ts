import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetplatformsService } from 'src/app/services/getplatforms.service';
import { MediaService } from 'src/app/services/mediaservice.service';

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

  constructor(
    private route: ActivatedRoute,
    private platformService: GetplatformsService,
    private mediaService: MediaService
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

  toggleHover(media: { isHovered: boolean }, value: boolean) {
    media.isHovered = value;
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
      .subscribe((data) => {
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].hasOwnProperty('yearofrelease')
        ) {
          this.mediaList = data;
        } else {
          this.mediaList = [];
        }
        console.log(data);
      });
  }

  handleMediaAdded(event: string) {
    if (event === 'ok') {
      console.log('ok recu coté parent');
      setTimeout(() => {
        this.loadMediaList(this.platform.id);
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
