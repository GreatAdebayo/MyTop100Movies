import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from './user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: UserService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser({ email, password });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}