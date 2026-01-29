import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { City } from '../../interfaces/city';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit {
  public cities: City[] = [];
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<City[]>(environment.baseUrl + 'api/cities').subscribe({
      next: (res) => {
        this.cities = res;
      },
      error: (err) => console.error(err)
    });
  }
}
