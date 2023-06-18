import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(cors<Request>());
app.use(express.json());
const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
    res.json({msg: 'Hello World'});
});

app.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    res.json(req.body);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
