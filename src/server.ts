/* imprting necessary npm packages */
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors';

/* importing app routes from handler files */
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import dashboardRoutes from './handlers/dashboards';

/* Express to run server and routes */
const app: express.Application = express();
const port = 3000;
const endPoint = '/';

/* Middleware*/
app.use(cors());
app.use(bodyParser.json());
// morgan HTTP logger
app.use(morgan('dev'));

/* The main GET route */
app.get(endPoint, (req: Request, res: Response) => {
  res.send('Server Started..');
});

/* use routes from handler files */
userRoutes(app);
productRoutes(app);
orderRoutes(app);
dashboardRoutes(app);

// Spin up the server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}${endPoint}`);
});

export default app;
