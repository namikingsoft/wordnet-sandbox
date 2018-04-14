// @flow
import Database from 'better-sqlite3';

const db = new Database('/resources/wnjpn.db');

export const search = (text: string) => {
  console.log(text);
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
    .all(`%${text}%`);

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
    data[synset] = childSenses.map(x => ({ ...x, link: 'self' }));
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

export default search;
