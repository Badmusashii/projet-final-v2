import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetplatformsService } from 'src/app/services/getplatforms.service';

@Component({
  selector: 'app-platformdetail',
  templateUrl: './platformdetail.component.html',
  styleUrls: ['./platformdetail.component.css'],
})
export class PlatformdetailComponent implements OnInit {
  platform: any;
  mediaTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private platformService: GetplatformsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // this.platform = this.platformService.getPlatform(id);
    if (id !== null) {
      this.platformService.getPlatform(Number(id)).subscribe((platform) => {
        this.platform = platform;
      });
    }
  }
  onSearch(searchText: string) {
    console.log(searchText); // searchText sera la valeur actuelle de l'input
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
}
