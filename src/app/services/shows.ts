import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getToken } from './storage.util';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ShowsService {

  private API = `${environment.apiUrl}/shows`;

  constructor(private http: HttpClient) {}

  getShows(page: number, limit: number, search?: string, type?: string) {

  let params = `?page=${page}&limit=${limit}`;

  if (search) params += `&search=${search}`;
  if (type && type !== 'All') params += `&type=${type}`;

  return this.http.get(`${this.API}${params}`);
}


}

