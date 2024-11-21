import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ProductRoute } from './app/config/modules/product/product.route';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//application routes
app.use('/api', ProductRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
