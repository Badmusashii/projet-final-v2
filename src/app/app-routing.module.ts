import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { CardselectComponent } from './pages/cardselect/cardselect.component';
import { PlatformdetailComponent } from './pages/platformdetail/platformdetail.component';
import { LoginComponent } from './pages/login/login.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { IntermediareComponent } from './pages/intermediare/intermediare.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'cardselect', component: CardselectComponent },
  { path: 'platform/:id', component: PlatformdetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'intermediaire', component: IntermediareComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
