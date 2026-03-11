import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerToasterService } from '../services/spinner-toaster.service';
import { finalize, catchError, throwError } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(SpinnerToasterService);

  service.showSpinner();

  return next(req).pipe(
    catchError((error) => {
      const errorMsg = error.error?.message || 'Something went wrong, Please try again';
      service.showToaster('error', errorMsg);
      return throwError(() => error);
    }),
    finalize(() => {
      service.hideSpinner();
    }),
  );
};
