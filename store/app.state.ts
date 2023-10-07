export interface AppState {
  encryptionKey: CryptoKey | null; // Ajoutez le type de votre clé
  iv: Uint8Array | number[] | null; // Ajoutez le type de votre IV
}
