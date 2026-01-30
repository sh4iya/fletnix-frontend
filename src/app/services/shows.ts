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

  getShows(page: number, limit: number) {
  const token = getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any>(
    `${this.API}?page=${page}&limit=${limit}`,
    { headers }
  );
}


}
