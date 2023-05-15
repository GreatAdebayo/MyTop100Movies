import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieSchema } from '../../schema/movie.schema';
import { CreateMovieDto } from '../../dto/create-movie.dto';
import axios from 'axios';


@Injectable()
export class MoviesService {
    constructor(@InjectModel('Movie') private movieSchema: Model<typeof MovieSchema>) { }



    async fetchAndSaveMoviesFromApi() {
        const apiKey = '1ebb902f87126e069613445cdc2b953f';
        const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
        try {
            const response = await axios.get(apiUrl);
            const moviesData = response.data.results;
            const movies = moviesData.map((movieData: any) => {
                return {
                    title: movieData.title,
                    description: movieData.overview,
                    releaseYear: parseInt(movieData.release_date?.substring(0, 4)),
                    genre: movieData.genre,
                    rating: movieData.vote_average,
                    poster: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                };
            });
            const savedMovies = await this.movieSchema.create(movies);
            return savedMovies;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }



    async create(createMovieDto: CreateMovieDto) {
        try {
            const createdMovie = new this.movieSchema(createMovieDto);
            return createdMovie.save();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
