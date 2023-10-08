import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { Store } from '@ngrx/store';
// import * as fromActions from 'store/encryption.action';
import { setIv, setEncryptionKey } from 'store/crypto.action';
import { CryptoService } from 'src/app/services/store-initializer-service.service';
// import { keyReducer } from 'store/key.reducer';
// import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  inscriptionForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private store: Store,
    private cryptoService: CryptoService
  ) {
    this.inscriptionForm = formBuilder.group(
      {
        username: ['', [Validators.required, Validators.maxLength(100)]],
        name: ['', [Validators.required, Validators.maxLength(255)]],
        surname: ['', [Validators.required, Validators.maxLength(255)]],
        email: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(255)],
        ],
        password: ['', [Validators.required, Validators.maxLength(255)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  ngOnInit(): void {}

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  passwordMismatch(): boolean {
    return (
      this.inscriptionForm.controls['confirmPassword'].errors?.['mismatch'] &&
      (this.inscriptionForm.controls['confirmPassword'].dirty ||
        this.inscriptionForm.controls['confirmPassword'].touched)
    );
  }

  async onSubmit(): Promise<void> {
    if (this.inscriptionForm.valid) {
      const user = this.inscriptionForm.value;
      // await this.cryptoService.initializeEncryption();
      // this.http.post('http://localhost:8080/api/auth/register', user).subscribe(
      //   (res) => {
      //     console.log('Utilisateur ajouter : ', res);
      //   },
      //   (err) => {
      //     console.log("Erreur lors de l'ajout de l'utilisateur");
      //   }
      // );
      // const salt = bcrypt.genSaltSync(10);
      // const encryptedUser = bcrypt.hashSync(JSON.stringify(user), salt);
      const textBuffer = new TextEncoder().encode(JSON.stringify(user));
      const key = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        textBuffer
      );
      const byteArray = new Uint8Array(encryptedData);
      let byteString = '';
      for (let i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
      }
      const encryptedTextBase64 = btoa(byteString);
      const urlSafeBase64 = encodeURIComponent(encryptedTextBase64);

      // Besoin de convertir le vecteur de type Unit8Array en tableau normal
      const ivArray = Array.from(iv);
      // const test = this.store.select(keyReducer);
      console.log('Dispatching setEncryptionKey with key:', key);
      // console.log('Dispatching setEncryptionKey');
      this.store.dispatch(setEncryptionKey({ encryptionKey: key }));

      console.log('Dispatching setIv with ivArray:', ivArray);
      this.store.dispatch(setIv({ iv: ivArray }));

      console.log('Encrypted Text:', encryptedTextBase64);
      const base64Regex =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      if (base64Regex.test(encryptedTextBase64)) {
        console.log('Ceci est une chaîne Base64 valide');
      } else {
        console.log("Ceci n'est pas une chaîne Base64 valide");
      }
      console.log(user);
      let templateParam = {
        to_name: user.surname,
        to_email: user.email,
        URL: `http://localhost:4200/intermediaire?encryptData=${urlSafeBase64}`,
      };
      emailjs
        .send(
          'service_1yxiu5o',
          'template_trhzfbr',
          templateParam,
          'pRgmNyucZbYDPmZZz'
        )
        .then(
          (result: EmailJSResponseStatus) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  }
}
