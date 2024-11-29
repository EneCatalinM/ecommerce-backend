import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const mockUser = { email: 'test@example.com', _id: 'userId123', role: 'customer' };
      const mockAccessToken = 'jwt.token.here';

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);
      jest.spyOn(authService, 'login').mockResolvedValue({ access_token: mockAccessToken });

      const result = await authController.login({ email: 'test@example.com', password: 'password123' });
      
      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ access_token: mockAccessToken });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        authController.login({ email: 'invalid@example.com', password: 'wrongpassword' })
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith('invalid@example.com', 'wrongpassword');
    });
  });
});
