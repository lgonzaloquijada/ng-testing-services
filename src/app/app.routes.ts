import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductsComponent } from '@components/products/products.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
];
