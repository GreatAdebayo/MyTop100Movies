import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieSchema } from '../../schema/movie.schema';
import axios from 'axios';
import { Types } from "mongoose"



@Injectable()
export class MoviesService {
    constructor(@InjectModel('Movie') private movieSchema: Model<typeof MovieSchema>) { }


    async fetchMoviesFromApi() {
        try {
            const response = await axios.get("http://api.themoviedb.org/3/discover/movie", {
                params: {
                    api_key: process.env.TMDB_KEY,
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
            return {
                status: 200,
                isSuccess: true,
                data: movies
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }




    async addMovies(user: Types.ObjectId, { id }) {
        try {
            // Check if movie already exists
            const findMovie = await this.movieSchema.findOne({ id })
            if (findMovie)
                return {
                    msg: "movie already exists",
                    status: 400,
                    isSuccess: false
                }

            // Make a request to the TMDb API to fetch movies
            const response = await axios.get(`http://api.themoviedb.org/3/movie/${id}`, {
                params: {
                    api_key: process.env.TMDB_KEY
                }
            })
            // Extract the required movie details from the response
            const movie = response.data;
            const newMovie = {
                user,
                id: movie.id,
                title: movie.title,
                description: movie.overview,
                releaseYear: parseInt(movie.release_date.substring(0, 4)),
                genre: movie.genres.map((genre: any) => genre.name),
                rating: movie.vote_average,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            };

            // Save the new movie
            let createdMovie = new this.movieSchema(newMovie);

            createdMovie = await createdMovie.save()

            return {
                status: 200,
                isSuccess: true,
                data: createdMovie
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }




    async getMovies(user: Types.ObjectId) {
        try {
            const movies = await this.movieSchema.find({ user })
            return {
                status: 200,
                isSuccess: true,
                data: movies
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }



    async getSingleMovie(user: Types.ObjectId, id: string) {
        try {
            const movie = await this.movieSchema.findOne({ id, user })
            if (!movie)
                return {
                    msg: "movie not found",
                    status: 400,
                    isSuccess: false
                }
            return {
                status: 200,
                isSuccess: true,
                data: movie
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }



    async deleteMovie(user: Types.ObjectId, id: string) {
        try {
            const movie = await this.movieSchema.findOne({ id, user })
            if (!movie)
                return {
                    msg: "movie not found",
                    status: 400,
                    isSuccess: false
                }


            // delete movie
            await this.movieSchema.deleteOne({ id, user });
            return {
                msg: "movie deleted",
                status: 200,
                isSuccess: true
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

}
