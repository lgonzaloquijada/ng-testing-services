import { TestBed } from '@angular/core/testing';

import { AuthService } from '@services/auth.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TokenService } from '@services/token.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { User } from '@models/user.model';
import { of } from 'rxjs';
import { UserMock } from '@models/user.mock';
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

  describe('Tests for getCurrentUser', () => {
    it('should get the user profile', () => {
      // Arrange
      const mockProfileData: User = UserMock.getOne();
      spyOn(tokenService, 'getToken').and.returnValue('token');
      spyOn(authService, 'getProfile').and.returnValue(of(mockProfileData));

      // Act
      authService.getCurrentUser();

      // Assert
      expect(tokenService.getToken).toHaveBeenCalled();
      expect(authService.getProfile).toHaveBeenCalled();
    });
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

  describe('Tests for getProfile', () => {
    it('should return the user profile', (doneFn) => {
      // Arrange
      const mockProfileData: User = UserMock.getOne();

      // Act
      authService.getProfile().subscribe((data) => {
        // Assert
        expect(data).toEqual(mockProfileData);
        doneFn();
      });

      // Assert
      const url = `${environment.API_URL}/api/v1/auth/profile`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProfileData);
    });

    it('should set the user', (doneFn) => {
      // Arrange
      const mockProfileData: User = UserMock.getOne();
      spyOn(authService.user, 'next').and.callThrough();

      // Act
      authService.getProfile().subscribe(() => {
        // Assert
        expect(authService.user.next).toHaveBeenCalledWith(mockProfileData);
        doneFn();
      });

      // Assert
      const url = `${environment.API_URL}/api/v1/auth/profile`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProfileData);
    });
  });

  describe('Tests for loginAndGet', () => {
    it('should login and get the user profile', (doneFn) => {
      // Arrange
      const mockAuth = { access_token: 'token' };
      const mockProfileData: User = UserMock.getOne();

      spyOn(authService, 'login').and.returnValue(of(mockAuth));
      spyOn(authService, 'getProfile').and.returnValue(of(mockProfileData));

      // Act
      authService
        .loginAndGet(mockProfileData.email, mockProfileData.password)
        .subscribe((data) => {
          // Assert
          expect(data).toEqual(mockProfileData);
          doneFn();
        });

      // Assert
      expect(authService.login).toHaveBeenCalled();
      expect(authService.getProfile).toHaveBeenCalled();
    });
  });

  describe('Tests for logout', () => {
    it('should remove the token and set the user to null', () => {
      // Arrange
      spyOn(tokenService, 'removeToken').and.callThrough();
      spyOn(authService.user, 'next').and.callThrough();

      // Act
      authService.logout();

      // Assert
      expect(tokenService.removeToken).toHaveBeenCalled();
      expect(authService.user.next).toHaveBeenCalledWith(null);
    });
  });
});
