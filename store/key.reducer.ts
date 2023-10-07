import { Action, ActionReducer } from '@ngrx/store';
import * as fromActions from 'store/encryption.action';

export const keyReducer: ActionReducer<CryptoKey | null, Action> = (
  state: CryptoKey | null = null,
  action: Action
) => {
  console.log('Action reçue dans keyReducer:', action); // Ajout du log ici

  if (action.type in fromActions.EncryptionActionTypes) {
    const encryptionAction = action as fromActions.EncryptionActions;
    switch (encryptionAction.type) {
      case fromActions.EncryptionActionTypes.SET_KEY:
        console.log('Setting Key', encryptionAction.payload);
        return encryptionAction.payload;
      case fromActions.EncryptionActionTypes.CLEAR_KEY:
        return null;
      default:
        return state;
    }
  }
  return state;
};
