import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {
  AppState,
  selectEncryptionKey,
  selectEncryptionState,
  selectIV,
} from 'store/crypto.selector';
import { CryptoState } from 'store/cryptostate';

import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-intermediare',
  templateUrl: './intermediare.component.html',
  styleUrls: ['./intermediare.component.css'],
})
export class IntermediareComponent implements OnInit {
  encryptedData: string | null = null;
  key$: Observable<CryptoKey | null>;
  iv$: Observable<Uint8Array | number[] | null>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    // this.key$ = this.store.select(selectEncryptionKey);
    // this.iv$ = this.store.select(selectIV);
    this.key$ = this.store
      .select(selectEncryptionKey)
      .pipe(filter((key) => !!key));
    this.iv$ = this.store.select(selectIV).pipe(filter((iv) => !!iv));
  }

  // ngOnInit(): void {
  //   this.encryptedData = this.route.snapshot.queryParams['encryptData'];
  //   if (this.encryptedData) {
  //     this.encryptedData = decodeURIComponent(this.encryptedData);
  //   }

  //   console.log('mon user crypté => ' + this.encryptedData);
  //   if (this.encryptedData && this.isValidBase64(this.encryptedData)) {
  //     // Continuez avec le traitement de la chaîne
  //     // ...
  //   } else {
  //     console.error("La chaîne n'est pas une chaîne Base64 valide.");
  //   }
  //   if (!this.encryptedData) return;
  //   const encryptedDataArray = new Uint8Array([
  //     ...atob(this.encryptedData)
  //       .split('')
  //       .map((char) => char.charCodeAt(0)),
  //   ]);
  //   combineLatest([
  //     this.store.select(selectEncryptionKey),
  //     this.store.select(selectIV),
  //   ]).subscribe(async ([key, iv]) => {
  //     if (key && iv) {
  //       const ivArray = new Uint8Array(iv);
  //       try {
  //         const decryptedData = await window.crypto.subtle.decrypt(
  //           {
  //             name: 'AES-GCM',
  //             iv: ivArray,
  //           },
  //           key,
  //           encryptedDataArray.buffer
  //         );

  //         const decryptedString = new TextDecoder().decode(
  //           new Uint8Array(decryptedData)
  //         );
  //         console.log('Données déchiffrées:', decryptedString);
  //       } catch (error) {
  //         console.error('Erreur lors du déchiffrement:', error);
  //       }
  //     }
  //   });
  // }

  // ngOnInit(): void {
  //   this.encryptedData = this.route.snapshot.queryParams['encryptData'];
  //   if (this.encryptedData) {
  //     this.encryptedData = decodeURIComponent(this.encryptedData);
  //   }

  //   if (!this.encryptedData) return;

  //   const encryptedDataArray = new Uint8Array([
  //     ...atob(this.encryptedData)
  //       .split('')
  //       .map((char) => char.charCodeAt(0)),
  //   ]);

  //   combineLatest([
  //     this.store.select(selectEncryptionKey),
  //     this.store.select(selectIV),
  //   ]).subscribe(async ([key, iv]) => {
  //     if (key && iv) {
  //       const ivArray = new Uint8Array(iv);
  //       try {
  //         const decryptedData = await window.crypto.subtle.decrypt(
  //           {
  //             name: 'AES-GCM',
  //             iv: ivArray,
  //           },
  //           key,
  //           encryptedDataArray.buffer
  //         );

  //         const decryptedString = new TextDecoder().decode(
  //           new Uint8Array(decryptedData)
  //         );
  //         const userObject = JSON.parse(decryptedString); // Si vos données déchiffrées sont en format JSON
  //         console.log('Données déchiffrées:', userObject);
  //       } catch (error) {
  //         console.error('Erreur lors du déchiffrement:', error);
  //       }
  //     }
  //   });
  // }

  // ngOnInit(): void {
  //   this.key$.subscribe((key) => {
  //     console.log("Clé du store lors de l'initialisation :", key);
  //   });
  //   // Récupérer les données cryptées depuis l'URL
  //   this.encryptedData = this.route.snapshot.queryParams['encryptData'];

  //   // Si les données cryptées existent
  //   if (this.encryptedData) {
  //     // Décoder les données de l'URL
  //     console.log('Avant décodage:', this.encryptedData);
  //     this.encryptedData = decodeURIComponent(this.encryptedData).replace(
  //       /\s+/g,
  //       ''
  //     );
  //     console.log('Après décodage:', this.encryptedData);

  //     // Vérifier si la chaîne est une Base64 valide
  //     if (this.isValidBase64(this.encryptedData)) {
  //       console.log('Base64 valide');
  //       // Votre logique supplémentaire ici
  //       // ...

  //       // Convertir la chaîne Base64 en un tableau d'octets
  //       const encryptedDataArray = new Uint8Array(
  //         Array.from(atob(this.encryptedData), (char) => char.charCodeAt(0))
  //       );

  //       // S'abonner aux changements de la clé et de l'IV dans le store
  //       combineLatest([
  //         this.store.select(selectEncryptionKey),
  //         this.store.select(selectIV),
  //       ]).subscribe(async ([key, iv]) => {
  //         console.log('Key et IV reçus:', key, iv);

  //         if (key && iv) {
  //           const ivArray = new Uint8Array(iv);
  //           try {
  //             // Essayer de déchiffrer les données
  //             const decryptedData = await window.crypto.subtle.decrypt(
  //               {
  //                 name: 'AES-GCM',
  //                 iv: ivArray,
  //               },
  //               key,
  //               encryptedDataArray.buffer
  //             );

  //             // Convertir les données déchiffrées en chaîne
  //             const decryptedString = new TextDecoder().decode(
  //               new Uint8Array(decryptedData)
  //             );
  //             console.log('Données déchiffrées:', decryptedString);
  //           } catch (error) {
  //             console.error('Erreur lors du déchiffrement:', error);
  //           }
  //         }
  //       });
  //     } else {
  //       console.error("La chaîne n'est pas une chaîne Base64 valide.");
  //     }
  //   }
  // }

  // ngOnInit(): void {
  //   this.key$
  //     .pipe(
  //       switchMap(async (key) => {
  //         // Utilisez 'async' ici
  //         console.log("Clé du store lors de l'initialisation :", key);
  //         return key; // Retournez la clé pour le traitement suivant
  //       })
  //     )
  //     .subscribe((key) => {
  //       // Récupérer les données cryptées depuis l'URL
  //       this.encryptedData = this.route.snapshot.queryParams['encryptData'];

  //       // Si les données cryptées existent
  //       if (this.encryptedData) {
  //         // Décoder les données de l'URL
  //         console.log('Avant décodage:', this.encryptedData);
  //         this.encryptedData = decodeURIComponent(this.encryptedData).replace(
  //           /\s+/g,
  //           ''
  //         );
  //         console.log('Après décodage:', this.encryptedData);

  //         // Vérifier si la chaîne est une Base64 valide
  //         if (this.isValidBase64(this.encryptedData)) {
  //           console.log('Base64 valide');
  //           // Votre logique supplémentaire ici
  //           // ...

  //           // Convertir la chaîne Base64 en un tableau d'octets
  //           const encryptedDataArray = new Uint8Array(
  //             Array.from(atob(this.encryptedData), (char) => char.charCodeAt(0))
  //           );

  //           // S'abonner aux changements de la clé et de l'IV dans le store
  //           combineLatest([
  //             this.store.select(selectEncryptionKey),
  //             this.store.select(selectIV),
  //           ]).subscribe(async ([key, iv]) => {
  //             console.log('Key et IV reçus:', key, iv);

  //             if (key && iv) {
  //               const ivArray = new Uint8Array(iv);
  //               try {
  //                 // Essayer de déchiffrer les données avec 'await'
  //                 const decryptedData = await window.crypto.subtle.decrypt(
  //                   {
  //                     name: 'AES-GCM',
  //                     iv: ivArray,
  //                   },
  //                   key,
  //                   encryptedDataArray.buffer
  //                 );

  //                 // Convertir les données déchiffrées en chaîne
  //                 const decryptedString = new TextDecoder().decode(
  //                   new Uint8Array(decryptedData)
  //                 );
  //                 console.log('Données déchiffrées:', decryptedString);
  //               } catch (error) {
  //                 console.error('Erreur lors du déchiffrement:', error);
  //               }
  //             }
  //           });
  //         } else {
  //           console.error("La chaîne n'est pas une chaîne Base64 valide.");
  //         }
  //       }
  //     });
  // }

  ngOnInit(): void {
    // Combine les observables de key et iv pour souscrire une seule fois
    // this.store.subscribe((state) =>
    //   console.log('le store => ' + JSON.stringify(state))
    // );

    this.store.pipe(select(selectEncryptionState)).subscribe((state) => {
      console.log('le store => ' + state);
    });
    combineLatest([
      this.store.select(selectEncryptionKey),
      this.store.select(selectIV),
    ])
      .pipe(
        tap(([key, iv]) => {
          console.log('Key et IV avant traitement:', key, iv);
        }),
        // Utilisez switchMap si nécessaire pour d'autres traitements asynchrones
        switchMap(async ([key, iv]) => {
          console.log("Clé et IV du store lors de l'initialisation:", key, iv);
          return { key, iv }; // Retournez un objet contenant la clé et l'IV pour le traitement suivant
        })
      )
      .subscribe(({ key, iv }) => {
        // Logique du déchiffrement ici
        this.encryptedData = this.route.snapshot.queryParams['encryptData'];
        if (this.encryptedData) {
          console.log('Avant décodage:', this.encryptedData);
          this.encryptedData = decodeURIComponent(this.encryptedData).replace(
            /\s+/g,
            ''
          );
          console.log('Après décodage:', this.encryptedData);

          if (this.isValidBase64(this.encryptedData)) {
            console.log('Base64 valide');
            const encryptedDataArray = new Uint8Array(
              Array.from(atob(this.encryptedData), (char) => char.charCodeAt(0))
            );
            if (key && iv) {
              const ivArray = new Uint8Array(iv);
              window.crypto.subtle
                .decrypt(
                  {
                    name: 'AES-GCM',
                    iv: ivArray,
                  },
                  key,
                  encryptedDataArray.buffer
                )
                .then((decryptedData) => {
                  const decryptedString = new TextDecoder().decode(
                    new Uint8Array(decryptedData)
                  );
                  console.log('Données déchiffrées:', decryptedString);
                })
                .catch((error) => {
                  console.error('Erreur lors du déchiffrement:', error);
                });
            }
          } else {
            console.error("La chaîne n'est pas une chaîne Base64 valide.");
          }
        }
      });
  }

  isValidBase64(str: string): boolean {
    return (
      typeof str === 'string' &&
      str.length % 4 === 0 &&
      /^[A-Za-z0-9+/]+[=]{0,2}$/.test(str)
    );
  }

  onClick() {
    // this.store.subscribe((state) =>
    //   console.log('le store dans le click => ' + JSON.stringify(state))
    // );
    // console.log(this.store.select(selectIV));
    // this.store.select(selectIV).subscribe((data) => {
    //   console.log('Valeur de IV:', data);
    // });
    this.store.pipe(select(selectIV)).subscribe((iv) => {
      console.log('Valeur de IV:', iv);
    });
    this.store.subscribe((state) => console.log(state)); // Ceci logguera tout le store à chaque changement
  }
}
