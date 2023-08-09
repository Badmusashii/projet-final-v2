import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.http
        .post('http://localhost:8080/api/userdg/login', loginData)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.router.navigate(['/settings']);
          },
          error: (err) => {
            console.log('Erreur lors du login : ', err);
            console.log("Détails de l'erreur:", JSON.stringify(err, null, 2));
          },
        });
    }
  }
  redirectToRegister(): void {
    this.router.navigate(['/inscription']);
  }
}
