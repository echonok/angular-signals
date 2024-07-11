import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoadingService } from '../loading/loading.service';
import { SkipLoading } from '../loading/skip-loading.token';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.loadingOn();
  return next(req).pipe(
    finalize(() => loadingService.loadingOff()),
  );
};
