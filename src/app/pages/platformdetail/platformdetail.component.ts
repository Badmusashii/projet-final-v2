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

    this.mediaService
      .getAllMediaByPlatformAndUser(id)
      .subscribe((mediaWithPlatforms) => {
        this.mediaList = mediaWithPlatforms;
      });
  }
  toggleHover(media: { isHovered: boolean }, value: boolean) {
    media.isHovered = value;
  }
  onSearch(searchText: string) {
    // Désinfection du champ de recherche
    const sanitizedSearchText = searchText.replace(/[^a-zA-Z0-9 ]/g, '');
    const platformId = this.platform.id;
    console.log(sanitizedSearchText);
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
      });
  }
  modifier(id: string) {
    console.log('Modifier l’élément avec l’ID:', id);
    // Insère ici le code pour modifier l'élément
  }

  supprimer(id: string) {
    console.log('Supprimer l’élément avec l’ID:', id);
    // Insère ici le code pour supprimer l'élément
  }
}
