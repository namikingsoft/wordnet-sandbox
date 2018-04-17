// @flow
import Database from 'better-sqlite3';

const db = new Database('/resources/wnjpn.db');

export const search = (text: string) => {
  const data = {};
  const selfSenses = db
    .prepare(
      `
      SELECT sense.synset, word.lemma FROM sense
        INNER JOIN word ON word.wordid = sense.wordid
        WHERE word.lemma LIKE ?
        ORDER BY sense.synset ASC
      `,
    )
    .all(`%${text}%`)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  selfSenses.forEach(({ synset }) => {
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
    data[synset] = { senses: childSenses, link: 'self' };
  });

  const findRecurcive = senses => {
    const preDataNum = Object.keys(data).length;
    senses.forEach(({ synset }) => {
      const synsSenses = db
        .prepare(
          `
          SELECT synlink.link, synlink.synset2 as synset FROM sense
            INNER JOIN word ON word.wordid = sense.wordid
            INNER JOIN synlink ON synlink.synset1 = sense.synset
            WHERE sense.synset = ?
              AND sense.lang = 'jpn'
            ORDER BY sense.synset ASC
          `,
        )
        .all(synset)
        .sort(() => Math.random() - 0.5)
        .slice(0, 7);
      synsSenses.forEach(({ link, ...s }) => {
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
          .all(s.synset);
        if (childSenses.length > 0 && !data[s.synset]) {
          data[s.synset] = { senses: childSenses, link };
        }
      });
      const dataNum = Object.keys(data).length;
      if (dataNum === preDataNum || dataNum > 30) return;
      findRecurcive(synsSenses);
    });
  };
  findRecurcive(selfSenses);

  Object.keys(data).forEach(synset => {
    const linkNet = {};
    const links = db
      .prepare(
        `
          SELECT synlink.* FROM synlink
            WHERE synlink.synset1 = ?
          `,
      )
      .all(synset);
    links.forEach(({ synset2, link }) => {
      if (data[synset2]) linkNet[synset2] = link;
    });
    data[synset] = { ...data[synset], linkNet };
  });

  return data;
};

export default search;
