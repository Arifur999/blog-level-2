import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { PostRouter } from './modules/post/post.router';
import { auth } from './lib/auth';

const app = express();
app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));


app.use("/posts", PostRouter);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
export default app;