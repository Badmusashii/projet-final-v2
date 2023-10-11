import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-intermediare',
  templateUrl: './intermediare.component.html',
  styleUrls: ['./intermediare.component.css'],
})
export class IntermediareComponent implements OnInit {
  token: string | null = null;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }
  verifyAndDecodeToken(token: string) {
    // Envoyez le token au serveur pour vérification et décodage
    this.http
      .post('https://localhost:8080/api/auth/register', { token: token })
      .subscribe(
        (res) => {
          console.log('Données utilisateur:', res);
        },
        (err) => {
          console.log('Erreur de vérification du token:', err);
        }
      );
  }

  onClick() {
    console.log('click');
    if (this.token) {
      this.verifyAndDecodeToken(this.token);
    }
  }
}
