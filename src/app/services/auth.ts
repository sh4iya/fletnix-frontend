import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}
  
// SIGNUP (REGISTER)
  signup(data: {
    fullName: string;
    email: string;
    password: string;
    age: number;
  }) {
    return this.http.post(
      `${this.API_URL}/auth/register`,
      data
    );
  }

//  LOGIN
  login(email: string, password: string) {
    return this.http.post<any>(
      `${this.API_URL}/auth/login`,
      { email, password },
      {
        withCredentials: false   
      }
    );
  }

// GET TOKEN
  getToken() {
    return localStorage.getItem('token');
   }
}
