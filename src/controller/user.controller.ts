import { NextFunction, Request, Response } from 'express';
import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import encryptPassword from '../utils/encyptpassword';
import { errorResponse, successResponse } from '../utils/responce';
import { handleYupError } from '../utils/yuperror';
import { LoginSchema, RegisterSchema } from '../validator/userValidation';

class userController {
  private _userDIController = DIcontainer.getGetAllUsersUseCase();

  async Create(req: Request, resp: Response, next: NextFunction) {
    try {
      await RegisterSchema.validate(req.body, { abortEarly: false });
      const userInfo = req.body;
      const { password, salt } = encryptPassword.Encrypt(userInfo.password);
      const userData = await this._userDIController.createUser({
        ...userInfo,
        salt: salt,
        password: password,
      });
      if (!userData) {
        throw new CustomError(statusMessage.badRequest, statusCode.badRequest);
      }
      return successResponse(resp, 'user register sucessfully', userData);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const formattedErrors = handleYupError(err);
        return errorResponse(resp, 'Validation failed', formattedErrors, 400);
      }
      return next(
        err instanceof CustomError
          ? err
          : new CustomError('An unexpected error occurred', 500),
      );
    }
  }

  //
  async Login(req: Request, resp: Response, next: NextFunction) {
    try {
      await LoginSchema.validate(req.body, { abortEarly: false });
      const loginData = req.body;
      const LoginUser = await this._userDIController.Login(loginData);
      if (LoginUser instanceof CustomError) {
        return next(LoginUser);
      }
      return successResponse(resp, 'sussessfully get The data', LoginUser);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const formattedErrors = handleYupError(err);
        return errorResponse(resp, 'Validation failed', formattedErrors, 400);
      }
      return next(
        err instanceof CustomError
          ? err
          : new CustomError('An unexpected error occurred', 500),
      );
    }
  }
}
export default userController;
