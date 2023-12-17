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
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  inscriptionForm!: FormGroup;
  uniqueToken!: string;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
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

  // passwordMismatch(): boolean {
  //   return (
  //     this.inscriptionForm.controls['confirmPassword'].errors?.['mismatch'] &&
  //     (this.inscriptionForm.controls['confirmPassword'].dirty ||
  //       this.inscriptionForm.controls['confirmPassword'].touched)
  //   );
  // }
  checkPasswordMatch(): void {
    const password = this.inscriptionForm.get('password')?.value;
    console.log('dans c=hekc => ' + password);
    const confirmPassword = this.inscriptionForm.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      this.toastr.warning(
        'Les mots de passe ne correspondent pas',
        'Attention!',
        {
          progressBar: true,
          timeOut: 3000,
          tapToDismiss: true,
          progressAnimation: 'increasing',
        }
      );
    }
  }

  passwordMismatch(): boolean {
    if (
      this.inscriptionForm.controls['confirmPassword'].errors?.['mismatch'] &&
      (this.inscriptionForm.controls['confirmPassword'].dirty ||
        this.inscriptionForm.controls['confirmPassword'].touched)
    ) {
      // Affichez le toast d'avertissement ici
      // this.toastr.warning(
      //   'Les mots de passe ne correspondent pas',
      //   'Attention!'
      // );
      return true;
    }
    return false;
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
      user.username = user.username.toLowerCase();
      user.name = user.name.toLowerCase();
      user.surname = user.surname.toLowerCase();
      user.email = user.email.toLowerCase();

      this.http
        .post<{ token: string }>(
          `${environment.api}/api/auth/confirmation`,
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
              URL: `https://data-geek.fr/intermediaire?token=${this.uniqueToken}`,
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
            this.toastr.success(
              'Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.',
              'Inscription réussie!',
              {
                timeOut: 15000,
                closeButton: true,
                progressBar: true,
                tapToDismiss: false, // Empêche la fermeture du toast en cliquant dessus
              }
            );
          },
          (err) => {
            console.log("Erreur lors de l'ajout de l'utilisateur");
            this.toastr.error(
              "Une erreur s'est produite lors de votre inscription. Veuillez réessayer.",
              "Erreur d'inscription",
              {
                timeOut: 5000, // 5 secondes
                closeButton: true,
                progressBar: true,
                tapToDismiss: true,
              }
            );
          }
        );
    }
  }
}
