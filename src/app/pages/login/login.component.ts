import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToggleService } from 'src/app/services/toggleservice.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { environment } from 'src/environments/environment';
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
    private toggleService: ToggleService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.authService.isAuthenticated.subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          // Si l'utilisateur est déjà authentifié, rediriger vers la page d'accueil ou une autre page
          this.router.navigate(['/cardselect']);
        }
      },
      (error) => {
        console.error(
          "Erreur lors de la vérification de l'authentification",
          error
        );
        this.router.navigate(['/login']);
      }
    );
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      loginData.username = loginData.username.toLowerCase();
      this.http
        .post(`${environment.api}/api/auth/login`, loginData, {
          withCredentials: true,
        })
        .subscribe({
          next: (res: any) => {
            this.authService.updateAuthenticationStatus(true, res.accessToken);
            this.toggleService.fetchAndSetTogglesForUser();
            this.router.navigate(['/cardselect']);
            console.log('Réponse du serveur:', res.accessToken);
          },
          error: (err) => {
            console.log('Erreur lors du login : ', err);
            console.log("Détails de l'erreur:", JSON.stringify(err, null, 2));
            this.authService.updateAuthenticationStatus(false, null);
          },
        });
    }
  }
  redirectToRegister(): void {
    this.router.navigate(['/inscription']);
  }
}
