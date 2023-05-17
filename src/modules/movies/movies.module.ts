import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from 'src/schema/movie.schema';
import { JwtStrategy } from '../user/jwt/jwt.strategy';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, JwtStrategy]
})
export class MoviesModule { }
