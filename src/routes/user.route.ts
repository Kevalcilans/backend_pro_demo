import express from 'express';
import userController from '../controller/user.controller';
import verifyToken from '../middlewares/Verifyauth';

const usercontroller = new userController();

export const route = express.Router();

route.post('/register', (req, resp, next) =>
  usercontroller.Create(req, resp, next),
);
route.post('/login', (req, resp, next) =>
  usercontroller.Login(req, resp, next),
);
route.get('/user', verifyToken, (req, resp, next) => {
  resp.send('token is working sucessfully');
});
export { route as userRoute };
