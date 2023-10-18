import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { CardselectComponent } from './pages/cardselect/cardselect.component';
import { PlatformdetailComponent } from './pages/platformdetail/platformdetail.component';
import { LoginComponent } from './pages/login/login.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { IntermediareComponent } from './pages/intermediare/intermediare.component';
import { GameInfoComponent } from './pages/game-info/game-info.component';
import { MovieInfoComponent } from './pages/movie-info/movie-info.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'cardselect', component: CardselectComponent },
  { path: 'platform/:id', component: PlatformdetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'intermediaire', component: IntermediareComponent },
  { path: 'gameInfo', component: GameInfoComponent },
  { path: 'movieInfo/:id', component: MovieInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
