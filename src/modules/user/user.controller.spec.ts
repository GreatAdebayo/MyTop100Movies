import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';


describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('createUser', () => {
    it('should create a new user and return a response', async () => {
      const userDto: UserDto = {
        password: 'password123',
        email: 'john_doe@example.com',
      };
      const responseDto = {
        status: 200,
        data: "token",
        isSuccess: true
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(responseDto);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await userController.createUser(userDto, res, null);

      expect(userService.createUser).toHaveBeenCalledWith(userDto);
      expect(res.status).toHaveBeenCalledWith(responseDto.status);
      expect(res.json).toHaveBeenCalledWith(responseDto);
    });
  });

  describe('login', () => {
    it('should log in a user and return a response', async () => {
      const user = { id: 1, username: 'john_doe' };
      const responseDto = {
        status: 200,
        data: "token",
        isSuccess: true
      };

      jest.spyOn(userService, 'login').mockResolvedValue(responseDto);

      const req = { user };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await userController.login(req, res);

      expect(userService.login).toHaveBeenCalledWith(user);
      expect(res.status).toHaveBeenCalledWith(responseDto.status);
      expect(res.json).toHaveBeenCalledWith(responseDto);
    });

    it('should throw an error if authentication fails', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      jest.spyOn(userService, 'login').mockRejectedValue(new Error('Invalid credentials'));

      await expect(userController.login(req, res)).rejects.toThrow('Invalid credentials');
    });
  });
});
