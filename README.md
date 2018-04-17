WordNet Visualization Sandbox [![CircleCI][circle-badge]][circle-url]
========================================

Getting Started
----------------------------------------

```bash
docker run --rm --name wordnetfront -p 3000:3000 -d \
  namikingsoft/wordnet-sandbox server
docker run --rm --name wordnetserver -p 8080:8080 -d \
  namikingsoft/wordnet-sandbox front

open http://localhost:8080
```

Development
----------------------------------------

```bash
docker-compose build
docker-compose run --rm yarn 
docker-compose up -d

open http://localhost:8080
```

Test
----------------------------------------

```bash
yarn install
yarn test
```

[circle-badge]: https://circleci.com/gh/namikingsoft/wordnet-sandbox.svg?style=svg
[circle-url]: https://circleci.com/gh/namikingsoft/wordnet-sandbox
