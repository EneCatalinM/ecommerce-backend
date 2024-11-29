import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserDocument } from '../users/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        role: 'customer',
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser as any);

      const result = await authService.validateUser('test@example.com', 'password123');

      expect(usersService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUser.validatePassword).toHaveBeenCalledWith('password123');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null);

      const result = await authService.validateUser('notfound@example.com', 'password123');

      expect(usersService.findUserByEmail).toHaveBeenCalledWith('notfound@example.com');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        role: 'customer',
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser as any);

      const result = await authService.validateUser('test@example.com', 'wrongpassword');

      expect(usersService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUser.validatePassword).toHaveBeenCalledWith('wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {
      const mockUser: UserDocument = {
        _id: 'userId123',
        email: 'test@example.com',
        role: 'customer',
      } as UserDocument;

      const mockToken = 'jwt.token.here';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
        role: mockUser.role,
      });
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});
