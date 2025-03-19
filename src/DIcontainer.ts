import { UserRepository } from './usecases/user.repository';
import UserService from './services/user.service';

class DIcontainer {
  private static _userRepo = new UserRepository();
  static getUerRepository() {
    return this._userRepo;
  }
  static getGetAllUsersUseCase() {
    return new UserService(this.getUerRepository());
  }
}
export default DIcontainer;
