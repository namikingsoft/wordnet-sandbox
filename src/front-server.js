// @flow
const express = require('express');
const fallback = require('express-history-api-fallback');
const compression = require('compression');
const path = require('path');

const port = Number(process.env.PORT) || 8080;
const host = process.env.DOCKER ? '0.0.0.0' : 'localhost';
const root = path.join(__dirname, '..', 'dist');
const app = express();

app.use(compression());
app.use(express.static(root));
app.use(fallback('index.html', { root }));
app.listen(port, host, () =>
  console.log(`Started Server: http://localhost:${port}`),
);
