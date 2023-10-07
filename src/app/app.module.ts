import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { PlatformsComponent } from './pages/platforms/platforms.component';
import { CardComponent } from './components/card/card.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { CardselectComponent } from './pages/cardselect/cardselect.component';
import { PlatformdetailComponent } from './pages/platformdetail/platformdetail.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PutmediabarComponent } from './components/putmediabar/putmediabar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { IntermediareComponent } from './pages/intermediare/intermediare.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ConnexionComponent,
    PlatformsComponent,
    CardComponent,
    SearchbarComponent,
    SettingsComponent,
    ToggleButtonComponent,
    CardselectComponent,
    PlatformdetailComponent,
    LoginComponent,
    InscriptionComponent,
    PutmediabarComponent,
    IntermediareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
