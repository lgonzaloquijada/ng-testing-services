import { Routes } from '@angular/router';
import { ProductsComponent } from '@components/products/products.component';
import { PicoPreviewComponent } from '@components/pico-preview/pico-preview.component';
import { HomeComponent } from '@components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'pico-preview',
    component: PicoPreviewComponent,
  },
];
