import { TestBed } from '@angular/core/testing';

import { AuthService } from '@services/auth.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TokenService } from '@services/token.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TokenService,
      ],
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('Tests for login', () => {
    it('should return a token', () => {
      // Arrange
      const mockAuth = { access_token: 'token' };
      const email = 'email';
      const password = 'password';

      // Act
      authService.login(email, password).subscribe((response) => {
        // Assert
        expect(response).toEqual(mockAuth);
      });

      // Assert
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(mockAuth);
    });

    it('should save the token', (doneFn) => {
      // Arrange
      const mockAuth = { access_token: 'token' };
      const email = 'email';
      const password = 'password';
      spyOn(tokenService, 'saveToken').and.callThrough();

      // Act
      authService.login(email, password).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockAuth);
        expect(tokenService.saveToken).toHaveBeenCalledWith(
          mockAuth.access_token
        );
        doneFn();
      });

      // Assert
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(mockAuth);
    });
  });
});
