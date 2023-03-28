import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface Category {
  name: string;
}

interface Entry<T> {
  id: number;
  attributes: T;
}

interface Response<T> {
  data: Entry<T>[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  allCategories$: Observable<Entry<Category>[]> | undefined;
  error: any | undefined;
  modifiedData = {
    name: '',
    description: '',
    categories: new Array<{ id: number; checked: boolean }>(),
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.allCategories$ = this.http
      .get<Response<Category>>('http://localhost:1337/api/categories')
      .pipe(
        catchError((error) => this.handleError(error)),
        map((response) => response.data),
        tap((data) => {
          data.forEach((x) => {
            this.modifiedData.categories.push({ id: x.id, checked: false });
          });
        })
      );
  }

  onSubmit(): void {
    const body = {
      data: {
        name: this.modifiedData.name,
        description: this.modifiedData.description,
        categories: this.modifiedData.categories
          .filter((x) => x.checked)
          .map((x) => x.id),
      },
    };

    this.http
      .post('http://localhost:1337/api/restaurants', body)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe((response) => {
        console.log(response);
        this.resetForm();
      });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error.message;
    return of();
  }

  private resetForm(): void {
    this.modifiedData.name = '';
    this.modifiedData.description = '';
    this.modifiedData.categories.forEach((x) => (x.checked = false));
  }
}
