import type {
  CreateUserInput,
  UpdateUserInput,
  UserPublic,
  LoginInput,
  LoginResult,
} from '../domain/entities/user.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../shared/errors/http-error.js';
import { JWT_EXPIRE_TIME_SECONDS, REFRESH_TOKEN_EXPIRE_TIME_MS } from '../shared/constants.js';
import { config } from '../config.js';
import { hashPassword, verifyPassword } from '../infrastructure/auth/password.js';
import { createAccessToken } from '../infrastructure/auth/jwt.js';
import { generateRefreshToken } from '../infrastructure/auth/token.js';
import * as userRepository from '../infrastructure/database/repositories/user.repository.js';
import * as tokenRepository from '../infrastructure/database/repositories/token.repository.js';

export class UserService {
  async createUser(input: CreateUserInput): Promise<UserPublic> {
    const hashedPassword = await hashPassword(input.password);

    const user = await userRepository.create({
      email: input.email,
      hashedPassword,
    });

    if (!user) {
      throw new ConflictError('User already exists');
    }

    return userRepository.toPublic(user);
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<UserPublic> {
    const hashedPassword = await hashPassword(input.password);

    const user = await userRepository.update(userId, {
      email: input.email,
      hashedPassword,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return userRepository.toPublic(user);
  }

  async login(input: LoginInput): Promise<LoginResult> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const isPasswordValid = await verifyPassword(input.password, user.hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const accessToken = createAccessToken(
      user.id,
      JWT_EXPIRE_TIME_SECONDS,
      config.api.jwtSecret
    );

    const refreshTokenValue = generateRefreshToken();
    await tokenRepository.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_TIME_MS),
    });

    return {
      user: userRepository.toPublic(user),
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const user = await userRepository.findByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    return createAccessToken(user.id, JWT_EXPIRE_TIME_SECONDS, config.api.jwtSecret);
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const user = await userRepository.findByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const revoked = await tokenRepository.revoke(refreshToken);

    if (!revoked) {
      throw new Error('Failed to revoke token');
    }
  }

  async upgradeToChirpyRed(userId: string): Promise<boolean> {
    return userRepository.upgradeToChirpyRed(userId);
  }

  async deleteAllUsers(): Promise<void> {
    await userRepository.deleteAll();
  }
}

export const userService = new UserService();
