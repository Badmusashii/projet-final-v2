import { Action, ActionReducer } from '@ngrx/store';
import * as fromActions from 'store/encryption.action';

export const ivReducer: ActionReducer<Uint8Array | number[] | null, Action> = (
  state: Uint8Array | number[] | null = null,
  action: Action
) => {
  if (action.type in fromActions.EncryptionActionTypes) {
    const encryptionAction = action as fromActions.EncryptionActions;
    switch (encryptionAction.type) {
      case fromActions.EncryptionActionTypes.SET_IV:
        console.log('Setting IV', encryptionAction.payload);
        return encryptionAction.payload;
      case fromActions.EncryptionActionTypes.CLEAR_IV:
        return null;
      default:
        return state;
    }
  }
  return state;
};
