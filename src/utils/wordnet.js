// @flow
import express from 'express';
import Database from 'better-sqlite3';

const db = new Database('/resources/wnjpn.db');

const getSyns = (str: string) => {
  const data = {};
  const senses = db
    .prepare(
      `
    SELECT sense.synset, word.lemma FROM sense
      INNER JOIN word ON word.wordid = sense.wordid
      WHERE word.lemma LIKE ?
      ORDER BY sense.synset ASC
  `,
    )
    .all(`%${str}%`);

  senses.forEach(({ synset }) => {
    const childSenses = db
      .prepare(
        `
      SELECT sense.synset, word.lemma FROM sense
        INNER JOIN word ON word.wordid = sense.wordid
        WHERE sense.synset = ?
          AND sense.lang = 'jpn'
        ORDER BY sense.synset ASC
    `,
      )
      .all(synset);
    data[synset] = childSenses;
  });

  senses.forEach(({ synset }) => {
    const synsSenses = db
      .prepare(
        `
      SELECT synlink.link, synlink.synset2 FROM sense
        INNER JOIN word ON word.wordid = sense.wordid
        INNER JOIN synlink ON synlink.synset1 = sense.synset
        WHERE sense.synset = ?
          AND sense.lang = 'jpn'
          -- AND synlink.link = 'syns'
        ORDER BY sense.synset ASC
    `,
      )
      .all(synset);
    synsSenses.forEach(({ link, synset2 }) => {
      const childSenses = db
        .prepare(
          `
        SELECT sense.synset, word.lemma FROM sense
          INNER JOIN word ON word.wordid = sense.wordid
          WHERE sense.synset = ?
            AND sense.lang = 'jpn'
          ORDER BY sense.synset ASC
      `,
        )
        .all(synset2);
      if (childSenses.length > 0) {
        data[synset2] = { ...childSenses, link };
      }
    });
  });
  return data;
};

const app = express();

app.get('/test', (req, res) => res.send('test'));

app.listen(3000, () => console.log('Start'));
