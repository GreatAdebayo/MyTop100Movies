import { MoviesService } from './movies.service';
import { Controller, Get, Post, Body, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';





@Controller('api/')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }



    @Get('fetch-from-api')
    async fetchMoviesFromApi(@Res() res) {
        const response = await this.moviesService.fetchMoviesFromApi();
        return res.status(response.status).json(response)
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('movies')
    async addMovies(@Req() req, @Body() body, @Res() res) {
        const response = await this.moviesService.addMovies(req.user.id, body);
        return res.status(response.status).json(response)
    }



    @UseGuards(AuthGuard('jwt'))
    @Get('movies')
    async getMovies(@Req() req, @Res() res) {
        const response = await this.moviesService.getMovies(req.user.id);
        return res.status(response.status).json(response)
    }



    @UseGuards(AuthGuard('jwt'))
    @Get('movies/:id')
    async getSingleMovie(@Req() req, @Param("id") id: string, @Res() res) {
        const response = await this.moviesService.getSingleMovie(req.user.id, id);
        return res.status(response.status).json(response)
    }



    @UseGuards(AuthGuard('jwt'))
    @Delete('movies/:id')
    async deleteMovie(@Req() req, @Param("id") id: string, @Res() res) {
        const response = await this.moviesService.deleteMovie(req.user.id, id);
        return res.status(response.status).json(response)
    }
}
