import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpStatusCode,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CreateProductDTO, Product } from '@models/product.model';
import { environment } from '@environments/environment';
import { ProductMock } from '@models/product.mock';
import { TokenInterceptor } from '@interceptors/token.interceptor';
import { TokenService } from './token.service';

fdescribe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        TokenService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  afterEach(() => {
    httpController.verify();
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

    it('should return an array of products sending token', (doneFn) => {
      // Arrange
      const mockProducts: Product[] = ProductMock.get(3);
      spyOn(tokenService, 'getToken').and.returnValue('123');

      productService.getAll().subscribe((products) => {
        // Assert
        expect(products.length).toEqual(mockProducts.length);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer 123');
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

    it('should return 0 when price is 0 or negative', (doneFn) => {
      // Arrange
      const mockProducts: Product[] = [
        {
          ...ProductMock.getOne(),
          price: 0,
        },
        {
          ...ProductMock.getOne(),
          price: -100,
        },
      ];

      productService.getAll().subscribe((products) => {
        // Assert
        expect(products[0].taxes).toEqual(0);
        expect(products[1].taxes).toEqual(0);
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

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      // Arrange
      const mockProducts: Product[] = ProductMock.get(3);
      const limit = 10;
      const offset = 3;

      productService.getAll(limit, offset).subscribe((products) => {
        // Assert
        expect(products.length).toEqual(mockProducts.length);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('limit')).toEqual(limit.toString());
      expect(req.request.params.get('offset')).toEqual(offset.toString());
      req.flush(mockProducts);
    });
  });

  describe('Tests for create', () => {
    it('should return the created product', (doneFn) => {
      // Arrange
      const mockProduct: Product = ProductMock.getOne();
      const dto: CreateProductDTO = {
        title: 'Product 1',
        price: 100,
        images: ['image1.jpg', 'image2.jpg'],
        description: 'Description',
        categoryId: 12,
      };

      productService.create({ ...dto }).subscribe((product) => {
        // Assert
        expect(product).toEqual(mockProduct);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(mockProduct);
      expect(req.request.body).toEqual(dto);
    });
  });

  describe('Tests for update', () => {
    it('should return the updated product', (doneFn) => {
      // Arrange
      const mockProduct: Product = ProductMock.getOne();
      const dto: CreateProductDTO = {
        title: 'Product 1',
        price: 100,
        images: ['image1.jpg', 'image2.jpg'],
        description: 'Description',
        categoryId: 12,
      };
      const productId = '1';

      productService.update(productId, { ...dto }).subscribe((product) => {
        // Assert
        expect(product).toEqual(mockProduct);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockProduct);
    });
  });

  describe('Tests for delete', () => {
    it('should return true when deleting a product', (doneFn) => {
      // Arrange
      const deletingId = '1';

      productService.delete(deletingId).subscribe((resp) => {
        // Assert
        expect(resp).toBeTrue();
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products/${deletingId}`;
      const req = httpController.expectOne(url);
      req.flush(true);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('Tests for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const mockProduct: Product = ProductMock.getOne();
      const productId = '1';

      productService.getOne(productId).subscribe((product) => {
        // Assert
        expect(product).toEqual(mockProduct);
        doneFn();
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should throw an error when product does not exist', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '404 Not Found';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (data) => {
          // Assert
          expect(data).toEqual('El producto no existe');
          doneFn();
        },
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(msgError, mockError);
    });

    it('should throw an error when server fails', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '409 Conflict';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (data) => {
          // Assert
          expect(data).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(msgError, mockError);
    });

    it('should throw an error when unauthorized', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '401 Unauthorized';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (data) => {
          // Assert
          expect(data).toEqual('No estas permitido');
          doneFn();
        },
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(msgError, mockError);
    });

    it('should throw an error when server fails', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '500 Internal Server Error';
      const mockError = {
        status: HttpStatusCode.InternalServerError,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (data) => {
          // Assert
          expect(data).toEqual('Ups algo salio mal');
          doneFn();
        },
      });

      // Act
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(msgError, mockError);
    });
  });
});
