import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Product } from '@models/product.model';
import { ProductsService } from '@services/product.service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductsService);
  products: WritableSignal<Product[]> = signal([]);

  constructor() {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllSimple().subscribe((products) => {
      this.products.set(products);
    });
  }
}
