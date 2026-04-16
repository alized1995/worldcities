import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { City } from '../../interfaces/city';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Country } from '../../interfaces/country';
import { count } from 'console';
import { ApiResult } from '../../interfaces/api-result';

@Component({
  selector: 'app-city-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInputModule, MatSelect, MatOption, CommonModule],
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.scss',
})
export class CityEditComponent implements OnInit {
  // properties

  form!: FormGroup;
  city?: City;
  id?: number;
  countries: Country[] = [];

  private http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [
        Validators.required,
        Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'), // Numeric pattern check
        Validators.min(-90),
        Validators.max(90)
      ]),
      lon: new FormControl('', [
        Validators.required,
        Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
        Validators.min(-180),
        Validators.max(180)
      ]),
      countryId: new FormControl('', Validators.required)
    });

    this.loadData();
  }

  loadData() {
    // load all countries for dropdown
    const countriesUrl = `${environment.baseUrl}api/countries?pageSize=9999`;
    this.http.get<ApiResult<Country>>(countriesUrl).subscribe({
      next: (result) => {
        this.countries = result.data;
      },
      error: (error) => console.error(error),
    });
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if (this.id) {
      const url = `${environment.baseUrl}api/cities/${this.id}`;
      this.http.get<City>(url).subscribe({
        next: (result) => {
          this.city = result;

          this.form.patchValue(this.city);
        },
        error: (error) => console.error(error),
      });
    }
  }

  onSubmit() {
    const city = this.id
      ? { ...this.city, ...this.form.value }
      : this.form.value;
    const url =
      `${environment.baseUrl}api/cities` + (this.id ? `/${this.id}` : ``);

    if (this.id) {
      // Edit: Put city
      this.http.put(url, city).subscribe({
        next: () => this.router.navigate(['/cities']),
        error: (err) => console.error(err),
      });
    } else {
      // create: Add new city
      this.http.post<City>(url, city).subscribe({
        next: () => this.router.navigate(['/cities']),
        error: (err) => console.error(err),
      });
    }
  }
}
