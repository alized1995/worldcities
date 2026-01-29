import { Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { CitiesComponent } from '../app/components/cities/cities.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cities', component: CitiesComponent },
];