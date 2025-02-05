import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Product } from '@models/product.model';
import { environment } from '@src/environments/environment';
import { ProductMock } from '@models/product.mock';

fdescribe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {
    it('should return an array of products', (doneFn) => {
      // Arrange
      const mockProducts: Product[] = ProductMock.get(3);

      productService.getAllSimple().subscribe((products) => {
        // Assert
        expect(products).toEqual(mockProducts);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });
});
