// @flow
import express from 'express';

const port = Number(process.env.PORT) || 3000;

const app = express();

app.get('/test', (req, res) => res.send('test'));

app.listen(port, () => console.log(`Started Server: http://localhost:${port}`));
