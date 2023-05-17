import { Body, Controller, UseGuards, Post, Req, Res, Request } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";





@Controller('api/')
export class UserController {
    constructor(private readonly userService: UserService) { }



    @Post('create-user')
    async createUser(@Body() body: UserDto, @Res() res, @Req() req) {
        const response = await this.userService.createUser(body)
        return res.status(response.status).json(response)
    }



    @UseGuards(AuthGuard('local'))
    @Post("login")
    async login(@Request() req: any, @Res() res) {
        const response = await this.userService.login(req.user)
        return res.status(response.status).json(response)
    }
}
