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
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { AccountupdateComponent } from './pages/accountupdate/accountupdate.component';
import { WhatComponent } from './pages/what/what.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'acceuil', component: LandingpageComponent },
  { path: 'cardselect', component: CardselectComponent },
  { path: 'platform/:id', component: PlatformdetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'update', component: AccountupdateComponent },
  { path: 'what', component: WhatComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'intermediaire', component: IntermediareComponent },
  { path: 'gameInfo', component: GameInfoComponent },
  { path: 'movieInfo/:id', component: MovieInfoComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
