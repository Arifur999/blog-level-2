import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();


app.get('/', (req, res) => {
    res.send('Hello, World!');
});
export default app;