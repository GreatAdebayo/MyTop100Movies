import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './modules/movies/movies.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://great:8AYkra15GXQJjimm@shop.wej5v.mongodb.net/top100?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }), MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
