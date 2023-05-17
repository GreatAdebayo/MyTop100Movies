import { Test } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { HttpStatus } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = moduleRef.get<MoviesController>(MoviesController);
    service = moduleRef.get<MoviesService>(MoviesService);
  });

  describe('fetchMoviesFromApi', () => {
    it('should fetch movies from the API and return a success response', async () => {
      // Arrange
      const response = {
        status: HttpStatus.OK,
        isSuccess: true,
        data: [{ id: 1, title: 'Movie 1' }],
      };
      jest.spyOn(service, 'fetchMoviesFromApi').mockResolvedValue(response);
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      await controller.fetchMoviesFromApi(res);

      // Assert
      expect(service.fetchMoviesFromApi).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(response.status);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe('addMovies', () => {
    it('should add a movie and return a success response', async () => {
      // Arrange
      const userId = 'user-id';
      const movieData = { id: '123456789' };
      const response = {
        status: HttpStatus.OK,
        isSuccess: true,
        data: { id: 1, title: 'New Movie' },
      };
      jest.spyOn(service, 'addMovies').mockResolvedValue(response);
      const req = { user: { id: userId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      await controller.addMovies(req, movieData, res);

      // Assert
      expect(service.addMovies).toHaveBeenCalledWith(userId, movieData);
      expect(res.status).toHaveBeenCalledWith(response.status);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe('getMovies', () => {
    it('should get all movies for a user and return a success response', async () => {
      // Arrange
      const userId = 'user-id';
      const response = {
        status: HttpStatus.OK,
        isSuccess: true,
        data: [{ id: 1, title: 'Movie 1' }],
      };
      jest.spyOn(service, 'getMovies').mockResolvedValue(response);
      const req = { user: { id: userId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      await controller.getMovies(req, res);

      // Assert
      expect(service.getMovies).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(response.status);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe('getSingleMovie', () => {
    it('should get a single movie for a user and return a success response', async () => {
      // Arrange
      const userId = 'user-id';
      const movieId = '123456789';
      const response = {
        status: HttpStatus.OK,
        isSuccess: true,
        data: { id: 1, title: 'Movie 1' },
      };
      jest.spyOn(service, 'getSingleMovie').mockResolvedValue(response);
      const req = { user: { id: userId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      await controller.getSingleMovie(req, movieId, res);

      // Assert
      expect(service.getSingleMovie).toHaveBeenCalledWith(userId, movieId);
      expect(res.status).toHaveBeenCalledWith(response.status);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie for a user and return a success response', async () => {
      // Arrange
      const userId = 'user-id';
      const movieId = '123456789';
      const response = {
        status: HttpStatus.OK,
        isSuccess: true,
        msg: 'Movie deleted',
      };
      jest.spyOn(service, 'deleteMovie').mockResolvedValue(response);
      const req = { user: { id: userId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      await controller.deleteMovie(req, movieId, res);

      // Assert
      expect(service.deleteMovie).toHaveBeenCalledWith(userId, movieId);
      expect(res.status).toHaveBeenCalledWith(response.status);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });
});

