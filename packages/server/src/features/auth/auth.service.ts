import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { decrypt, encrypt } from 'src/utils/functions';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './auth.type';
import { UserRole } from 'src/core/consts/enum';
import { User } from '../users/entities/user.entity';
import { LoginRes } from 'shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<LoginRes> {
    const user = await this.userService.findOneByNameOrEmail(username);
    if (password == (await decrypt(user.password))) {
      return {
        access_token: await this.createTokenFromUser(user)
      }
    }
    throw new UnauthorizedException(`Wrong password for user ${username}`);
  }

  async createTokenFromUser(user: User): Promise<string> {
    const payload: TokenPayload = { sub: user.id, role: user.role };
    return await this.jwtService.signAsync(payload)
  }

  async loginAfterRegistration(user: User) {

    return {
        access_token: await this.createTokenFromUser(user)
    }
  }

  async register(username: string, email: string, password: string) {
    const passwordHash = await encrypt(password);
    const user = await this.userService.create({
      name: username,
      email: email,
      password: passwordHash,
      role: UserRole.USER
    })
    const result = await this.loginAfterRegistration(user);
    return result
  }

  async registerByAdmin(username: string, email: string, password: string, role?: UserRole) {
    const passwordHash = await encrypt(password);
    const user = await this.userService.create({
      name: username,
      email: email,
      password: passwordHash,
      role: role || UserRole.USER
    })
    const result = await this.loginAfterRegistration(user);
    return result
  }
}
