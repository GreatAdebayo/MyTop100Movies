import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";



@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userSchema: Model<UserDto>,
        private readonly jwtService: JwtService,) {
    }



    async createUser({ email, password }: UserDto) {
        try {
            // check if email already exists
            const checkEmail = await this.userSchema.findOne({ email })
            if (checkEmail)
                return {
                    msg: "email already exists",
                    status: 400,
                    isSuccess: false,

                }
            //encrypt password
            const salt = 10;
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = new this.userSchema({
                email,
                password: hashedPassword
            });
            await user.save()

            // generate JWT
            const payload = { sub: user.id };
            return {
                status: 200,
                isSuccess: true,
                data: this.jwtService.sign(payload)
                
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }



    async validateUser({ email, password }: UserDto) {
        try {
            const user = await this.userSchema.findOne({ email });

            // Check password
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) return user;
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }





    async login(user) {
        try {
            // Generate JWT
            const payload = { sub: user.id };
            return {
                status: 200,
                isSuccess: true,
                data: this.jwtService.sign(payload)
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
