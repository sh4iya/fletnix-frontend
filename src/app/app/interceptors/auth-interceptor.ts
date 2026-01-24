import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    console.log('INTERCEPTOR TOKEN (from localStorage):', token);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('INTERCEPTOR SENDING HEADER:', cloned.headers?.get('Authorization'));
      return next(cloned);
    }
  }

  console.log('INTERCEPTOR: no token, sending original req');
  return next(req);
};

