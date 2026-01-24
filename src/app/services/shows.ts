import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getToken } from './storage.util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShowsService {
 private API = `${environment.apiUrl}/shows`;

  constructor(private http: HttpClient) {}

  getShows() {
    const token = getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    console.log('SENDING TOKEN:', token);

    return this.http.get<any[]>(this.API, { headers });
  }
}
