import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from 'src/app/services/mediaservice.service';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { AnimationSyncService } from 'src/app/services/anim-syncro.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css'],
})
export class MovieInfoComponent implements OnInit {
  movieId!: number | null;
  movieDetails: any;
  movieVideos: any;
  isLoading: boolean = true;
  safeUrl!: SafeResourceUrl;
  areVideosLoaded: boolean = false;
  // someHtmlContent: SafeHtml;
  safeHtmlContents: SafeHtml[] = [];

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private sanitizer: DomSanitizer,
    private animSyncro: AnimationSyncService
  ) {
    // this.someHtmlContent =
    //   this.sanitizer.bypassSecurityTrustHtml(`<p>Loading...</p>`);
  }

  // ngOnInit(): void {
  //   const guid = this.route.snapshot.params['id'];
  //   if (guid !== null) {
  //     this.movieId = +guid;
  //   }

  //   console.log('ID du film : ', this.movieId); // Pour le débogage

  //   if (this.movieId !== null) {
  //     this.mediaService.getMovieDetails(this.movieId).subscribe(
  //       (data) => {
  //         const apiResponse = data; // Stockage de la réponse dans une constante
  //         console.log("Réponse de l'API :", apiResponse); // Pour le débogage

  //         this.movieDetails = apiResponse;
  //         if (apiResponse && apiResponse.videos) {
  //           console.log('Videos are being loaded');
  //           this.movieVideos = apiResponse.videos.results;
  //           this.safeHtmlContents = this.movieVideos.map((video: any) => {
  //             const videoKey = video.key;
  //             if (videoKey) {
  //               return this.sanitizer.bypassSecurityTrustHtml(
  //                 `<iframe width="400" height="200" src="https://www.youtube.com/embed/${videoKey}" allowfullscreen loading="lazy"></iframe>`
  //               );
  //             }
  //             return null;
  //           });

  //           // À ce point, utilisez DomSanitizer pour sécuriser l'URL
  //           const unsafeUrl = this.movieVideos[0]?.url; // Remplacez par la vraie URL

  //           if (unsafeUrl) {
  //             this.safeUrl =
  //               this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  //           }
  //         }

  //         this.isLoading = false; // Positionnement à false une fois que les données sont récupérées
  //       },
  //       (error) => {
  //         console.log('Erreur :', error); // Pour le débogage en cas d'erreur
  //         this.isLoading = false;
  //       }
  //     );
  //   }
  // }
  ngOnInit(): void {
    const guid = this.route.snapshot.params['id'];
    if (guid !== null) {
      this.movieId = +guid;
    }

    if (this.movieId !== null) {
      this.mediaService.getMovieDetails(this.movieId).subscribe(
        (data) => {
          this.movieDetails = data;
          if (data && data.videos) {
            this.movieVideos = data.videos.results;
            this.setIframeSize();
          }

          this.isLoading = false;
        },
        (error) => {
          console.log('Erreur :', error);
          this.isLoading = false;
        }
      );
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setIframeSize();
  }

  setIframeSize(): void {
    const windowWidth = window.innerWidth;
    let iframeWidth: number, iframeHeight: number;

    // if (windowWidth < 350) {
    //   iframeWidth = 300;
    //   iframeHeight = 200;
    // } else if (windowWidth < 450) {
    //   iframeWidth = 20;
    //   iframeHeight = 250;
    // } else {
    //   iframeWidth = 500;
    //   iframeHeight = 300;
    // }
    if (windowWidth >= 1100) {
      iframeWidth = 500;
      iframeHeight = 300;
    } else if (windowWidth >= 950) {
      iframeWidth = 400;
      iframeHeight = 250;
    } else if (windowWidth >= 850) {
      iframeWidth = 300;
      iframeHeight = 150;
    } else if (windowWidth >= 700) {
      iframeWidth = 250;
      iframeHeight = 150;
    } else if (windowWidth >= 600) {
      iframeWidth = 180;
      iframeHeight = 120;
    } else if (windowWidth >= 500) {
      iframeWidth = 180;
      iframeHeight = 120;
    }
    this.safeHtmlContents = this.movieVideos.map((video: any) => {
      const videoKey = video.key;
      if (videoKey) {
        return this.sanitizer.bypassSecurityTrustHtml(
          `<iframe width="${iframeWidth}" height="${iframeHeight}" src="https://www.youtube.com/embed/${videoKey}" allowfullscreen loading="lazy"></iframe>`
        );
      }
      return null;
    });
  }

  getSafeUrl(key: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/' + key
    );
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
