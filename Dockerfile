FROM node:8.11.1-wheezy

RUN apt-get update\
 && apt-get install -y --no-install-recommends mecab libmecab-dev sqlite3\
 && apt-get clean\
 && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp

RUN mkdir /resources

RUN wget http://compling.hss.ntu.edu.sg/wnja/data/1.1/wnjpn.db.gz\
 && gzip -d wnjpn.db.gz\
 && mv wnjpn.db /resources/

RUN git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git\
 && cd mecab-ipadic-neologd\
 && mkdir -p "$(mecab-config --dicdir)"\
 && ./bin/install-mecab-ipadic-neologd -n -y\
 && mv /usr/lib/mecab/dic/mecab-ipadic-neologd /resources/\
 && sed -i "s/^dicdir = /; dicdir = /g" /etc/mecabrc\
 && echo "dicdir = /resources/mecab-ipadic-neologd" >> /etc/mecabrc\
 && cd ..\
 && rm -rf mecab-ipadic-neologd

COPY package.json /app/
COPY yarn.lock /app/

WORKDIR /app

RUN yarn install

COPY . /app
