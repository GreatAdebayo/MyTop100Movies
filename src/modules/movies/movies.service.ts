import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieSchema } from '../../schema/movie.schema';
import { CreateMovieDto, MovieIdDto } from '../../dto/create-movie.dto';
import axios from 'axios';


@Injectable()
export class MoviesService {
    constructor(@InjectModel('Movie') private movieSchema: Model<typeof MovieSchema>) { }



    async fetchMoviesFromApi() {
        const apiKey = '1ebb902f87126e069613445cdc2b953f';
        const apiUrl = `http://api.themoviedb.org/3/discover/movie`;
        try {
            const response = await axios.get(apiUrl, {
                params: {
                    api_key: apiKey,
                    sort_by: 'popularity.desc'
                }
            });
            const moviesData = response.data.results;
            const movies = moviesData.map((movieData: any) => {
                return {
                    id: movieData.id,
                    title: movieData.title,
                    description: movieData.overview,
                    releaseYear: parseInt(movieData.release_date?.substring(0, 4)),
                    genre: movieData.genre,
                    rating: movieData.vote_average,
                    poster: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                };
            });
            return movies;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }






    async addMovies(movieId: MovieIdDto) {
        const apiKey = '1ebb902f87126e069613445cdc2b953f';
        const { id } = movieId
        try {
            // Make a request to the TMDb API to fetch movies
            const response = await axios.get(`http://api.themoviedb.org/3/movie/${id}`, {
                params: {
                    api_key: apiKey
                }
            })
            // Extract the required movie details from the response
            const movie = response.data;
            const newMovie = {
                title: movie.title,
                description: movie.overview,
                releaseYear: parseInt(movie.release_date.substring(0, 4)),
                genre: movie.genres.map((genre: any) => genre.name),
                rating: movie.vote_average,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                // createdBy: req.user.userId
            };
            // Save the new movie
            const createdMovie = new this.movieSchema(newMovie);
            return await createdMovie.save()
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
