import { MoviesService } from './movies.service';
import { CreateMovieDto, MovieIdDto } from '../../dto/create-movie.dto';
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

@Controller('api/')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }



    @Post('fetch-from-api')
    async fetchAndSaveFromApi() {
        const movies = await this.moviesService.fetchMoviesFromApi();
        return movies;
    }


    @Post('add-movies')
    addMovies(@Body() movieId: MovieIdDto) {
        return this.moviesService.addMovies(movieId);
    }
}
