import express, { Express, Response, Request } from 'express';
import cors from 'cors';
import env from 'dotenv';
import { userRoute } from './routes/user.route';
import { errorHandler } from './middlewares/errorHanddler';
import 'tsconfig-paths/register';
env.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/example', (req: Request, res: Response) => {
  res.send('Hello World');
});
app.use('/user', userRoute);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server is up and running ${process.env.PORT} `);
});
