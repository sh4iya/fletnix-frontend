import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {}



  canActivate(route: unknown, state: unknown): boolean {
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  window.location.href = '/login';
  return false;
}

}


