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


//definicija ruta
app.use('/', homeRouter);


const hostname = '127.0.0.1';
const port = 4010;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
