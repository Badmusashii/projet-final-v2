import { NgModule } from '@angular/core';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { keyReducer } from './key.reducer';
import { ivReducer } from './iv.reducer';

export interface FeatureState {
  key: CryptoKey | null;
  iv: Uint8Array | number[] | null;
}

export const featureReducers: ActionReducerMap<FeatureState> = {
  key: keyReducer,
  iv: ivReducer,
};

@NgModule({
  //   imports: [StoreModule.forFeature('featureName', featureReducers)],
  imports: [StoreModule.forRoot({ encryptionKey: keyReducer, iv: ivReducer })],
  exports: [StoreModule],
})
export class StoreFeatureModule {}
