export interface User {
  id: string;
  UserId: number;
  firstName: string;
  lastName: string;
  password: string;
  salt: string;
  email: string;
  phone: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface userLogin {
  email: string;
  password: string;
}
