import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    if (!payload.sub) {
      this.logger.error('No sub in payload');
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'role', 'isActive'],
      relations: ['tenant'],
    });

    if (!user) {
      this.logger.error(`User with id ${payload.sub} not found`);
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      this.logger.error(`User ${user.id} is inactive`);
      throw new UnauthorizedException();
    }

    this.logger.debug(`User validated: ${JSON.stringify(user)}`);
    return user;
  }
}
