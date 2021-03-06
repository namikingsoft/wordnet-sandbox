WordNet Visualization Sandbox
========================================
Install docker required.

Getting Started
----------------------------------------

```bash
docker run --rm --name wordnetserver -p 3000:3000 -d \
  namikingsoft/wordnet-sandbox server
docker run --rm --name wordnetfront -p 8080:8080 -d \
  namikingsoft/wordnet-sandbox front

open http://localhost:8080
```

Development
----------------------------------------

```bash
docker-compose build
docker-compose run --rm app yarn
docker-compose up -d

open http://localhost:8080
```

Test
----------------------------------------

```bash
docker-compose run --rm app yarn test
docker-compose run --rm app yarn test:watch
```

Powered by
----------------------------------------

[Japanese Wordnet (vXX) © 2009-2011 NICT, 2012-2015 Francis Bond and 2016-2017 Francis Bond, Takayuki Kuribayashi](http://compling.hss.ntu.edu.sg/wnja/index.en.html) [[License](http://compling.hss.ntu.edu.sg/wnja/license.txt)]