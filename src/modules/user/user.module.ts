import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from "./jwt/jwt.constant";
import { LocalStrategy } from './local.strategy';


@Module({
  imports: [
    PassportModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000s' },
    })
  ],
  providers: [UserService, LocalStrategy],
  controllers: [UserController]
})
export class UserModule { }
