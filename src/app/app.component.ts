import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

interface Restaurant {
  name: string;
  description: string;
}

interface Entry<T> {
  id: number;
  attributes: T;
}

interface Response {
  data: Entry<Restaurant>[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  error: any | undefined;
  restaurants$: Observable<Restaurant[]> | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const url = 'http://localhost:1337/api/restaurants';
    const opts = { params: { populate: '*' } };

    this.restaurants$ = this.http.get<Response>(url, opts).pipe(
      catchError((error) => this.handleError(error)),
      map((response) => response.data.map((x) => x.attributes))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error;
    return of();
  }
}
