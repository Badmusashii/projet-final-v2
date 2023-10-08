import { createAction, props } from '@ngrx/store';

export const setEncryptionKey = createAction(
  '[Crypto] Set Encryption Key',
  props<{ encryptionKey: CryptoKey | null }>()
);

export const setIv = createAction(
  '[Crypto] Set IV',
  props<{ iv: Uint8Array | number[] | null }>()
);
