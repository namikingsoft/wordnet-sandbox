FROM node:8.11.1-wheezy

ENV DOCKER true
ENV APP_ROOT /app

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

COPY package.json $APP_ROOT/
COPY yarn.lock $APP_ROOT/

WORKDIR $APP_ROOT

RUN yarn install\
 && yarn cache clean

COPY . $APP_ROOT
COPY ./docker-entrypoint.sh /

RUN yarn server:build\
 && yarn front:build

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["server"]

EXPOSE 3000
EXPOSE 8080
