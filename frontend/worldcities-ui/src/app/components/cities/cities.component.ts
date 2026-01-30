import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { City } from '../../interfaces/city';
import { MatTableModule } from '@angular/material/table';
import { ApiResult } from '../../interfaces/api-result';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatFormField,MatInputModule],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit, OnDestroy {
  public cities: City[] = [];
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  
  // pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;
  sortColumn: string = "name";
  sortOrder: string = "asc"
  public filterQuery: string | null = null;
  private filterTextChanged: Subject<string> = new Subject<string>;
  private filterSubscription?: Subscription;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.loadData();

    this.filterSubscription = this.filterTextChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.filterQuery = query;
      this.pageIndex = 0;
      this.loadData();
  });
  }

  onFilterTextChanged(filterText: string){
    this.filterTextChanged.next(filterText);
  }

  getData(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  loadData(sortEvent: Sort | null = null){
    if (sortEvent) {
    this.sortColumn = sortEvent.active;
    this.sortOrder = sortEvent.direction;
  }
    const url = `${environment.baseUrl}api/cities` +
              `?pageIndex=${this.pageIndex}` +
              `&pageSize=${this.pageSize}` +
              `&sortColumn=${this.sortColumn}` +
              `&sortOrder=${this.sortOrder}` +
              (this.filterQuery ? `&filterQuery=${this.filterQuery}` : '');

    this.http.get<ApiResult<City>>(url).subscribe({
      next: (res) => {
        this.cities = res.data;
        this.totalCount = res.totalCount;
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(){
    this.filterSubscription?.unsubscribe();
  }
}
