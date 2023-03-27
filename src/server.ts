/* imprting necessary npm packages */
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors';
import routes from './handlers/routes_index';

/* Express to run server and routes */
const app: express.Application = express();
const port = 3000;
const endPoint = '/';

/* Middleware*/
app.use(cors());
app.use(bodyParser.json());
// morgan HTTP logger
app.use(morgan('dev'));
// connect to the api routes
app.use('/api', routes);

/* The main GET route */
app.get(endPoint, (req: Request, res: Response) => {
  res.send('Server Started, go to /api');
});

// Spin up the server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}${endPoint}`);
});

export default app;
