import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerToasterService } from '../services/spinner-toaster.service';
import { finalize, catchError, throwError } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(SpinnerToasterService);
  const skipSpinner = req.headers.has('X-Skip-Spinner');

  if (!skipSpinner) {
    service.showSpinner();
  }

  return next(req).pipe(
    catchError((error) => {
      const errorMsg = error.error?.message || 'Something went wrong, Please try again';
      service.showToaster('error', errorMsg);
      return throwError(() => error);
    }),
    finalize(() => {
      if (!skipSpinner) {
        service.hideSpinner();
      }
    }),
  );
};
