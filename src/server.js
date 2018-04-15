// @flow
import express from 'express';
import cors from 'cors';

import * as wordnet from './utils/wordnet';

const port = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());

app.get('/wordnet/search', (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).send({ error: 'required text param' });
  return res.status(200).send(wordnet.search(text));
});

app.listen(port, () => console.log(`Started Server: http://localhost:${port}`));
