import { AppState } from './app.state';
import { createSelector } from '@ngrx/store';

export const selectEncryptionKey = (state: AppState) => state.encryptionKey;
export const selectIV = (state: AppState) => state.iv;
