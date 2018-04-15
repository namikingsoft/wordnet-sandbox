// @flow
import Database from 'better-sqlite3';

const db = new Database('/resources/wnjpn.db');

export const search = (text: string) => {
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
    data[synset] = { senses: childSenses, link: 'self' };
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
      if (childSenses.length > 0 && !data[synset2]) {
        data[synset2] = { senses: childSenses, link };
      }
    });
  });

  Object.keys(data).forEach(synset => {
    const linkNet = {};
    // Object.keys(data).forEach(s => {
    //   if (
    //     synset !== s &&
    //     data[synset].link === 'self' &&
    //     data[synset].link === data[s].link
    //   ) {
    //     linkNet[s] = data[s].link;
    //   }
    // });
    {
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
    }
    // {
    //   const links = db
    //     .prepare(
    //       `
    //       SELECT synlink.* FROM synlink
    //         WHERE synlink.synset2 = ?
    //       `,
    //     )
    //     .all(synset);
    //   links.forEach(({ synset1, link }) => {
    //     if (data[synset1]) linkNet[synset1] = link;
    //   });
    // }
    data[synset] = { ...data[synset], linkNet };
  });

  return data;
};

export default search;
