import { MoviesService } from './movies.service';
import { CreateMovieDto } from '../../dto/create-movie.dto';
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

@Controller('api/')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }




    @Post('fetch-from-api')
    async fetchAndSaveFromApi() {
        const savedMovies = await this.moviesService.fetchAndSaveMoviesFromApi();
        return savedMovies;
    }


    @Post()
    create(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.create(createMovieDto);
    }
}
