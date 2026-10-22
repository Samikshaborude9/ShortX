import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      validatePassword: jest.fn(),
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return user info with token', async () => {
      mockUsersService.create.mockResolvedValue({
        id: 'u1',
        name: 'Alice',
        email: 'alice@example.com',
      });

      const result = await service.register({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        user: { id: 'u1', name: 'Alice', email: 'alice@example.com' },
        accessToken: 'mock-jwt-token',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'u1', email: 'alice@example.com' });
    });
  });

  describe('login', () => {
    it('should log in successfully with valid credentials', async () => {
      const user = { id: 'u1', name: 'Alice', email: 'alice@example.com' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUsersService.validatePassword.mockResolvedValue(true);

      const result = await service.login({ email: 'alice@example.com', password: 'password123' });

      expect(result).toEqual({
        user,
        accessToken: 'mock-jwt-token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 'u1', email: 'alice@example.com' });
      mockUsersService.validatePassword.mockResolvedValue(false);

      await expect(
        service.login({ email: 'alice@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should return a success message', async () => {
      const result = await service.logout();
      expect(result.message).toContain('Logged out successfully');
    });
  });
});
