import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setIv, setEncryptionKey } from 'store/crypto.action';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor(private store: Store) {}

  async initializeEncryption(): Promise<void> {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    this.store.dispatch(setEncryptionKey({ encryptionKey: key }));
    this.store.dispatch(setIv({ iv: Array.from(iv) }));
  }
}
