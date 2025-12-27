import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PostRouter } from './modules/post/post.router';

const app = express();



app.use("/posts", PostRouter);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
export default app;