import { createReducer, on, Action } from '@ngrx/store';
import { setEncryptionKey, setIv } from 'store/crypto.action';
import { CryptoState } from 'store/cryptostate';

export const initialState: CryptoState = {
  encryptionKey: null,
  iv: [],
};

// const _cryptoReducer = createReducer(
//   initialState,
//   on(setEncryptionKey, (state, { encryptionKey }) => ({
//     ...state,
//     encryptionKey,
//   })),
//   on(setIv, (state, { iv }) => ({ ...state, iv }))
// );

// const _cryptoReducer = createReducer(
//   initialState,
//   on(setEncryptionKey, (state, { encryptionKey }) => {
//     console.log('Received encryptionKey:', encryptionKey);
//     return { ...state, encryptionKey };
//   }),
//   on(setIv, (state, { iv }) => {
//     console.log('Received IV:', iv);
//     return { ...state, iv };
//   })
// );

const _cryptoReducer = createReducer(
  initialState,
  on(setEncryptionKey, (state, { encryptionKey }) => {
    // console.log('Setting encryptionKey:', encryptionKey);
    console.log('Avant changement, encryptionKey:', state.encryptionKey);
    console.log('Nouveau encryptionKey:', encryptionKey);
    return { ...state, encryptionKey };
  }),
  on(setIv, (state, { iv }) => {
    // console.log('Setting iv:', iv);
    console.log('Avant changement, iv:', state.iv);
    console.log('Nouveau iv:', iv);

    return { ...state, iv };
  })
);

export function cryptoReducer(state: CryptoState | undefined, action: Action) {
  return _cryptoReducer(state, action);
}
