import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
interface User extends JwtPayload {
  id: string;
  UserId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  username: string;
}

interface UserRequest extends Request {
  user?: User;
}

export default UserRequest;
