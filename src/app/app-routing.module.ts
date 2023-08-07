import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { CardselectComponent } from './pages/cardselect/cardselect.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'cardselect', component: CardselectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
