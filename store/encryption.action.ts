import { Action } from '@ngrx/store';

export enum EncryptionActionTypes {
  SET_KEY = '[Encryption] Set Key',
  CLEAR_KEY = '[Encryption] Clear Key',
  SET_IV = '[Encryption] Set IV',
  CLEAR_IV = '[Encryption] Clear IV',
}

export class SetKey implements Action {
  readonly type = EncryptionActionTypes.SET_KEY;
  constructor(public payload: CryptoKey) {}
}

export class ClearKey implements Action {
  readonly type = EncryptionActionTypes.CLEAR_KEY;
}

export class SetIV implements Action {
  readonly type = EncryptionActionTypes.SET_IV;
  constructor(public payload: Uint8Array | number[]) {}
}

export class ClearIV implements Action {
  readonly type = EncryptionActionTypes.CLEAR_IV;
}

export type EncryptionActions = SetKey | ClearKey | SetIV | ClearIV;
