import express from 'express';
import path from 'path'
import dotenv from 'dotenv';
import {homeRouter} from './routes/home.routes';

dotenv.config()

const app = express();
app.use(express.static(path.join(__dirname, 'scripts')));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4010;

//definicija ruta
app.use('/', homeRouter);


if (externalUrl) {
    const hostname = '0.0.0.0'; //ne 127.0.0.1
    app.listen(port, hostname, () => {
      console.log(`Server locally running at http://${hostname}:${port}/ and from
      outside on ${externalUrl}`);}
      );
  } else {
    const hostname = '127.0.0.1';
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
