import { ActionReducerMap } from '@ngrx/store';
import { keyReducer } from './key.reducer';
import { ivReducer } from './iv.reducer';
import { AppState } from './app.state';
import { EncryptionActions } from './encryption.action';

export const reducers: ActionReducerMap<AppState> = {
  encryptionKey: keyReducer,
  iv: ivReducer,
};
