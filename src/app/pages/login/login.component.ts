import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToggleService } from 'src/app/services/toggleservice.service';
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
    private http: HttpClient,
    private toggleService: ToggleService
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
        .post('http://localhost:8080/api/auth/login', loginData, {
          withCredentials: true,
        })
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.accessToken);
            this.toggleService.fetchAndSetTogglesForUser();
            this.router.navigate(['/settings']);
            console.log('Réponse du serveur:', res);
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
