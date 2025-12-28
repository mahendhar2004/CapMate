import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/error';

const app = express();

app.use(express.json());
app.use('/listings', routes); // Mount under /listings
app.use(errorHandler);

export default app;
