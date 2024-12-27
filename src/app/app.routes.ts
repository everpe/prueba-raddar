import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'tiny-url',
        loadComponent: () => import('./components/tiny-url/tiny-url.component').then(m => m.TinyUrlComponent)
      },
      { path: '', redirectTo: '/tiny-url', pathMatch: 'full' },
      { path: '**', redirectTo: '/tiny-url' } // Ruta de fallback
];
