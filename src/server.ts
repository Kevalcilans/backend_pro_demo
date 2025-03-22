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

const PORT = process.env.PORT || 3001;

app.get('/example', (req: Request, res: Response) => {
  res.send('Hello World');
});
app.use('/user', userRoute);
app.use(errorHandler);

app.listen(PORT || 8000, () => {
  console.log(`server is up and running ${PORT} `);
});
