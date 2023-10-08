import { createSelector } from '@ngrx/store';

export interface AppState {
  cryptoReducer: {
    encryptionKey: CryptoKey | null;
    iv: Uint8Array | number[] | null;
  };
}

export const selectEncryptionState = (state: AppState) => state.cryptoReducer;

// export const selectEncryptionKey = createSelector(
//   selectEncryptionState,
//   (encryptionState) => encryptionState.key
// );
export const selectEncryptionKey = createSelector(
  selectEncryptionState,
  (encryptionState) => (encryptionState ? encryptionState.encryptionKey : null)
);

// export const selectIV = createSelector(
//   selectEncryptionState,
//   (encryptionState) => encryptionState.iv
// );
export const selectIV = createSelector(
  selectEncryptionState,
  (encryptionState) => (encryptionState ? encryptionState.iv : null)
);
