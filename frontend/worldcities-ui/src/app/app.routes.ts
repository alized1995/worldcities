import { Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { CitiesComponent } from '../app/components/cities/cities.component';
import { CityEditComponent } from './components/city-edit/city-edit.component';
import { CountriesComponent } from './components/countries/countries.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cities', component: CitiesComponent },
  { path: 'city/:id', component: CityEditComponent}, // Edit Mode
  { path: 'city', component: CityEditComponent}, // Add mode
  { path: 'countries', component: CountriesComponent }
];