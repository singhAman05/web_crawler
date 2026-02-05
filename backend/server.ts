import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import crawlerRoute from './routes/crwaler_route';
dotenv.config({ quiet: true });

const PROJECT = process.env.PROJECT_NAME;
const PORT = process.env.PORT || 6000;
const API_VERSION = process.env.API_VERSION || 'api/v3';

const app = express()
const server = http.createServer(app)
app.use(express.json());
app.use(cors());

app.use(`/${API_VERSION}`,crawlerRoute);


app.get('/',(req,res)=>{
    res.send(`Hi!! from server side of ${PROJECT}`)
})

app.use(errorHandler);
server.listen(PORT,()=>{
    console.log(`The server is listening at ${PORT}`);
})