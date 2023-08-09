import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  inscriptionForm!: FormGroup;

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

  onSubmit(): void {
    if (this.inscriptionForm.valid) {
      const user = this.inscriptionForm.value;
      this.http.post('http://localhost:8080/api/userdg/create', user).subscribe(
        (res) => {
          console.log('Utilisateur ajouter : ', res);
        },
        (err) => {
          console.log("Erreur lors de l'ajout de l'utilisateur");
        }
      );
    }
  }
}
