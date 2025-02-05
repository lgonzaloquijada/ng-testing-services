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

  describe('Tests for getAll', () => {
    it('should return an array of products', (doneFn) => {
      // Arrange
      const mockProducts: Product[] = ProductMock.get(3);

      productService.getAll().subscribe((products) => {
        // Assert
        expect(products.length).toEqual(mockProducts.length);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should return an array of products with taxes', (doneFn) => {
      // Arrange
      const mockProducts: Product[] = [
        {
          ...ProductMock.getOne(),
          price: 100,
        },
        {
          ...ProductMock.getOne(),
          price: 200,
        },
        {
          ...ProductMock.getOne(),
          price: 300,
        },
      ];

      productService.getAll().subscribe((products) => {
        // Assert
        expect(products[0].taxes).toEqual(100 * 0.19);
        expect(products[1].taxes).toEqual(200 * 0.19);
        expect(products[2].taxes).toEqual(300 * 0.19);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should return an array of products with taxes and retry 3 times', (doneFn) => {
      // Arrange
      const mockProducts: Product[] = ProductMock.get(3);

      productService.getAll().subscribe((products) => {
        // Assert
        expect(products).toEqual(
          mockProducts.map((item) => {
            return {
              ...item,
              taxes: 0.19 * item.price,
            };
          })
        );
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      const req2 = httpController.expectOne(url);
      expect(req2.request.method).toBe('GET');
      req2.flush(mockProducts, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      const req3 = httpController.expectOne(url);
      expect(req3.request.method).toBe('GET');
      req3.flush(
        mockProducts.map((item) => {
          return {
            ...item,
            taxes: 0.19 * item.price,
          };
        })
      );
    });
  });
});
