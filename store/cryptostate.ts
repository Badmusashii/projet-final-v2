export interface CryptoState {
  encryptionKey: CryptoKey | null;
  iv: Uint8Array | number[] | null;
}
