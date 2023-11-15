import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserDg } from 'src/app/components/models/user-dg';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-accountupdate',
  templateUrl: './accountupdate.component.html',
  styleUrls: ['./accountupdate.component.css'],
})
export class AccountupdateComponent implements OnInit {
  userUpdateForm!: FormGroup;
  user!: UserDg;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private userService: AuthService
  ) {
    this.userUpdateForm = formBuilder.group(
      {
        username: ['', [Validators.maxLength(100)]],
        name: ['', [Validators.maxLength(255)]],
        surname: ['', [Validators.maxLength(255)]],
        email: ['', [Validators.email, Validators.maxLength(255)]],
        newPassword: ['', [Validators.maxLength(255)]],
        oldPassword: ['', [Validators.required, Validators.maxLength(255)]],
        confirmNewPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  ngOnInit(): void {
    this.userService.getOne().subscribe((data) => {
      this.user = data;
      console.log(this.user, 'dnas le.ts');
    });
    this.userUpdateForm.get('newPassword')?.valueChanges.subscribe((value) => {
      // this.checkPasswordValidation();
    });

    this.userUpdateForm
      .get('confirmNewPassword')
      ?.valueChanges.subscribe((value) => {
        // this.checkPasswordValidation();
      });
    this.toastr.info(
      'Veuillez entrer votre mot de passe pour toutes modifications.',
      'Information'
    );
  }
  checkPasswordValidation(): void {
    const newPassword = this.userUpdateForm.get('newPassword')?.value;
    const confirmNewPassword =
      this.userUpdateForm.get('confirmNewPassword')?.value;

    if (newPassword && !confirmNewPassword) {
      this.toastr.warning(
        'La confirmation du nouveau mot de passe est requise.',
        'Attention !'
      );
    } else if (newPassword !== confirmNewPassword) {
      this.toastr.error('Les mots de passe ne correspondent pas.', 'Erreur');
    }
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;

    if (newPassword && !confirmNewPassword) {
      return { confirmRequired: true };
    }

    if (newPassword !== confirmNewPassword) {
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
    const newPassword = this.userUpdateForm.get('newPassword')?.value;
    console.log('dans c=hekc => ' + newPassword);
    const confirmNewPassword =
      this.userUpdateForm.get('confirmNewPassword')?.value;

    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
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
      this.userUpdateForm.controls['confirmNewPassword'].errors?.['mismatch'] &&
      (this.userUpdateForm.controls['confirmNewPassword'].dirty ||
        this.userUpdateForm.controls['confirmNewPassword'].touched)
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

  // async onSubmit(): Promise<void> {
  //   if (this.inscriptionForm.valid) {
  //     const user = this.inscriptionForm.value;
  //     this.http
  //       .post<{ token: string }>(
  //         'https://localhost:8080/api/auth/confirmation',
  //         user
  //       )
  //       .subscribe(
  //         (res) => {
  //           console.log('Utilisateur ajouté : ', res);
  //           this.uniqueToken = res.token;
  //           console.log(this.uniqueToken);

  //           // Déplacer le code pour envoyer l'e-mail ici
  //           let templateParam = {
  //             to_name: user.surname,
  //             to_email: user.email,
  //             URL: `https://localhost:4200/intermediaire?token=${this.uniqueToken}`,
  //           };
  //           emailjs
  //             .send(
  //               'service_1yxiu5o',
  //               'template_trhzfbr',
  //               templateParam,
  //               'pRgmNyucZbYDPmZZz'
  //             )
  //             .then(
  //               (result: EmailJSResponseStatus) => {
  //                 console.log(result.text);
  //               },
  //               (error) => {
  //                 console.log(error.text);
  //               }
  //             );
  //         },
  //         (err) => {
  //           console.log("Erreur lors de l'ajout de l'utilisateur");
  //         }
  //       );
  //   }
  // }
  // async onSubmit(): Promise<void> {
  //   if (this.userUpdateForm.errors?.['confirmRequired']) {
  //     this.toastr.warning(
  //       'La confirmation du nouveau mot de passe est requise.',
  //       'Attention !'
  //     );
  //   }

  //   if (this.userUpdateForm.errors?.['mismatch']) {
  //     this.toastr.error('Les mots de passe ne correspondent pas.', 'Erreur');
  //   }
  //   this.checkPasswordMatch();

  //   console.log(this.userUpdateForm.value);
  //   console.log(this.userUpdateForm.valid);
  //   console.log(this.userUpdateForm.errors);
  //   const formValue = {
  //     username: this.userUpdateForm.get('username')?.value.toLowerCase(),
  //     name: this.userUpdateForm.get('name')?.value.toLowerCase(),
  //     surname: this.userUpdateForm.get('surname')?.value.toLowerCase(),
  //     email: this.userUpdateForm.get('email')?.value.toLowerCase(),
  //     oldPassword: this.userUpdateForm.get('oldPassword')?.value,
  //     newPassword: this.userUpdateForm.get('newPassword')?.value,
  //     confirmNewPassword: this.userUpdateForm.get('confirmNewPassword')?.value,
  //   };
  //   console.log(formValue);
  //   this.userService.updateProfile(formValue).subscribe(
  //     (res) => {
  //       console.log(res);
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la mise à jour du profil', error);
  //     }
  //   );
  // }
  async onSubmit(): Promise<void> {
    // Vérifications des erreurs de validation des mots de passe
    if (this.userUpdateForm.errors?.['confirmRequired']) {
      this.toastr.warning(
        'La confirmation du nouveau mot de passe est requise.',
        'Attention !'
      );
    }

    if (this.userUpdateForm.errors?.['mismatch']) {
      this.toastr.error('Les mots de passe ne correspondent pas.', 'Erreur');
    }
    this.checkPasswordMatch();

    const formValue: { [key: string]: any } = {};
    const fields = [
      'username',
      'name',
      'surname',
      'email',
      'oldPassword',
      'newPassword',
      'confirmNewPassword',
    ];

    fields.forEach((field) => {
      const value = this.userUpdateForm.get(field)?.value;
      if (value && field !== 'oldPassword') {
        // Exclure oldPassword si vide
        formValue[field] = value;
      }
    });

    console.log(formValue);

    // Envoyer la requête de mise à jour uniquement si formValue contient des données
    if (Object.keys(formValue).length > 0) {
      this.userService.updateProfile(formValue).subscribe(
        (res) => {
          console.log('Mise à jour réussie', res);
          this.toastr.success('Profil mis à jour avec succès!', 'Succès');
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du profil', error);
          this.toastr.error(
            'Erreur lors de la mise à jour du profil.',
            'Erreur'
          );
        }
      );
    } else {
      console.log('Aucune modification à soumettre');
      this.toastr.info('Aucune modification détectée.', 'Info');
    }
  }
}
