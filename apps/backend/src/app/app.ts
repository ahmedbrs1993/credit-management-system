import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import actionsRoutes from './routes/actions';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(actionsRoutes);

export default app;
