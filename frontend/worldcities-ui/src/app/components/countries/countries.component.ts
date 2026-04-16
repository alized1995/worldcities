import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { Country } from '../../interfaces/country';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ApiResult } from '../../interfaces/api-result';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [MatPaginator, MatSort, MatFormField, MatLabel, MatTableModule],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent {
public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totCities'];
  public countries: Country[] = [];

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: SortDirection = "asc";
  filterQuery: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private filterTextChanged: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadData();
    
    // Author's Debounce Logic for Countries Search
    this.filterTextChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.filterQuery = query;
      this.loadData();
    });
  }

  loadData(event?: PageEvent) {
    var pageIndex = (event) ? event.pageIndex : this.defaultPageIndex;
    var pageSize = (event) ? event.pageSize : this.defaultPageSize;
    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;

    var url = environment.baseUrl + 'api/Countries';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (this.filterQuery) {
      params = params.set("filterQuery", this.filterQuery);
    }

    this.http.get<ApiResult<Country>>(url, { params }).subscribe(result => {
      this.countries = result.data;
      this.paginator.length = result.totalCount || 0;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
    });
  }

  onFilterTextChanged(filterText: string) {
    this.filterTextChanged.next(filterText);
  }

  selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0] as File;
}

onUpload() {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile, this.selectedFile.name);

  const url = environment.baseUrl + 'api/Countries/Import';
  
  this.http.post(url, formData).subscribe({
    next: (result) => {
      console.log('Import successful');
      this.loadData(); // Table refresh karein
    },
    error: (error) => console.error('Import failed', error)
  });
}
}
