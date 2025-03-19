// import { statusCode } from 'src/config/statuscode';
import { statusCode } from '../config/statuscode';
import { User, userLogin } from '../domain/entity/user';
import { UserRepository } from '../usecases/user.repository';
import { CustomError } from '../utils/customeerror';
import encryptPassword from '../utils/encyptpassword';
import JwtToken from '../utils/jwtToken';
import _ from 'lodash';

export default class UserService {
  constructor(private userRepo: UserRepository) {}

  async createUser(userData: User): Promise<User> {
    try {
      const userAvailable = await this.userRepo.findByEmail(userData.email);
      if (userAvailable) {
        throw new CustomError('User already exists', 404);
      }
      return await this.userRepo.create(userData);
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  async Login(userData: userLogin) {
    const userAvailable = await this.userRepo.findByEmail(userData.email);
    if (!userAvailable) {
      return new CustomError(
        'email address is already exists',
        statusCode.badRequest,
      );
    }
    const decryptPassword = encryptPassword.Decrypt(
      userData.password,
      userAvailable.password,
      userAvailable.salt,
    );
    if (!decryptPassword) {
      return new CustomError('Invalid credentials', statusCode.badRequest);
    }
    const updateUser = _.omit(userAvailable, [
      'password',
      'salt',
      'updatedAt',
      'createdAt',
      'deletedAt',
    ]);
    const createJwt = JwtToken.createJwt(
      updateUser,
      process.env.JWT_SECRET_KEY ?? '',
      {
        expiresIn: '1h',
      },
    );
    return {
      ...updateUser,
      Token: createJwt,
    };
  }
}
