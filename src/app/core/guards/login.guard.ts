import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map((authState) => {
      if (authState.isAuthenticated) {
        // If already logged in, redirect to incidents or return URL
        const returnUrl = route.queryParams['returnUrl'] || '/incidents';
        router.navigate([returnUrl]);
        return false;
      }
      return true;
    }),
  );
};
