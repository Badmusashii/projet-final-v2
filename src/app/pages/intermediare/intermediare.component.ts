import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-intermediare',
  templateUrl: './intermediare.component.html',
  styleUrls: ['./intermediare.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IntermediareComponent implements OnInit {
  token: string | null = null;
  captchaResolved: boolean = false;

  // grecaptcha!: Window;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    setTimeout(() => {
      if ((window as any).grecaptcha) {
        (window as any).grecaptcha.render('element-id', {
          sitekey: '6LcmSSkpAAAAAIgmsie8qj4p83y9y_2cf1QNkZpR',
          callback: (response: any) => {
            if (response) {
              this.captchaOk();
            }
          },
        });
      }
    }, 1000);
  }
  onSubmit() {
    const recaptchaResponse = (window as any).grecaptcha.getResponse();
    if (this.token && recaptchaResponse) {
      this.verifyAndDecodeToken(this.token, recaptchaResponse);
    }
  }
  verifyAndDecodeToken(token: string, recaptchaResponse: string) {
    // Envoyez le token au serveur pour vérification et décodage
    this.http
      .post(
        `${environment.api}/api/auth/register`,
        {
          token,
          recaptchaResponse,
        },
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (res) => {
          console.log('Données utilisateur:', res);
          this.router.navigate(['login']);
        },
        (err) => {
          console.log('Erreur de vérification du token:', err);
        }
      );
  }
  captchaOk() {
    this.captchaResolved = true;
    console.log(this.captchaResolved);
  }

  // onClick() {
  //   console.log('click');
  //   if (this.token) {
  //     this.verifyAndDecodeToken(this.token);
  //     this.router.navigate(['/settings']);
  //   }
  // }
}
