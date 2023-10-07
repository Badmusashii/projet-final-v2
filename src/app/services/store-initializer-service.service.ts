// import { Injectable } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { selectEncryptionKey } from 'store/selectors';
// import { selectIV } from 'store/selectors';

// @Injectable({
//   providedIn: 'root',
// })
// export class StoreInitializerServiceService {
//   constructor(private store: Store) {}

//   initializeStore(): Promise<void> {
//     return new Promise<void>((resolve) => {
//       this.store.select(selectEncryptionKey, selectIV).subscribe((key) => {
//         if (key) {
//           resolve();
//         }
//       });
//     });
//   }
// }
