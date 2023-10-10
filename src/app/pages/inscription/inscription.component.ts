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
import { Token } from '@angular/compiler';
// import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  inscriptionForm!: FormGroup;
  uniqueToken!: string;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
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

  // async onSubmit(): Promise<void> {
  //   if (this.inscriptionForm.valid) {
  //     const user = this.inscriptionForm.value;
  //     this.http
  //       .post<{ token: string }>(
  //         'http://localhost:8080/api/auth/confirmation',
  //         user
  //       )
  //       .subscribe(
  //         (res) => {
  //           console.log('Utilisateur ajouter : ', res);
  //           this.uniqueToken = res.token;
  //           console.log(this.uniqueToken);
  //         },
  //         (err) => {
  //           console.log("Erreur lors de l'ajout de l'utilisateur");
  //         }
  //       );

  //     let templateParam = {
  //       to_name: user.surname,
  //       to_email: user.email,
  //       URL: `http://localhost:4200/intermediaire?token=${this.uniqueToken}`,
  //     };
  //     emailjs
  //       .send(
  //         'service_1yxiu5o',
  //         'template_trhzfbr',
  //         templateParam,
  //         'pRgmNyucZbYDPmZZz'
  //       )
  //       .then(
  //         (result: EmailJSResponseStatus) => {
  //           console.log(result.text);
  //         },
  //         (error) => {
  //           console.log(error.text);
  //         }
  //       );
  //   }
  // }

  async onSubmit(): Promise<void> {
    if (this.inscriptionForm.valid) {
      const user = this.inscriptionForm.value;
      this.http
        .post<{ token: string }>(
          'http://localhost:8080/api/auth/confirmation',
          user
        )
        .subscribe(
          (res) => {
            console.log('Utilisateur ajouté : ', res);
            this.uniqueToken = res.token;
            console.log(this.uniqueToken);

            // Déplacer le code pour envoyer l'e-mail ici
            let templateParam = {
              to_name: user.surname,
              to_email: user.email,
              URL: `http://localhost:4200/intermediaire?token=${this.uniqueToken}`,
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
          },
          (err) => {
            console.log("Erreur lors de l'ajout de l'utilisateur");
          }
        );
    }
  }
}
