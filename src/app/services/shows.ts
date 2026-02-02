import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getToken } from './storage.util';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ShowsService {

  private API = `${environment.apiUrl}/shows`;

  constructor(private http: HttpClient) {}

  getShows(page: number, limit: number, search: string, type: string) {
  let url = `${this.API}?page=${page}&limit=${limit}`;

  if (search) url += `&search=${search}`;
  if (type && type !== 'All') url += `&type=${type}`;

  return this.http.get<any>(url);
}

}

