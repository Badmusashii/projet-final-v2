// crypto.module.ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { cryptoReducer } from './crypto.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // si nécessaire pour la configuration de l'environnement

@NgModule({
  imports: [StoreModule.forFeature('cryptoReducer', cryptoReducer)],
})
export class CryptoModule {}
