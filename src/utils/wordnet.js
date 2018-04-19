// @flow
import Database from 'better-sqlite3';

const db = new Database('/resources/wnjpn.db');

export const search = async (text: string) => {
  const data = {};
  const selfSenses = db
    .prepare(
      `
      SELECT sense.synset, word.lemma FROM sense
        INNER JOIN word ON word.wordid = sense.wordid
        WHERE word.lemma LIKE ?
      `,
    )
    .all(`%${text}%`)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  selfSenses.forEach(({ synset, lemma }) => {
    const childSenses = db
      .prepare(
        `
        SELECT sense.synset, word.lemma FROM sense
          INNER JOIN word ON word.wordid = sense.wordid
          WHERE sense.lang = 'jpn'
            AND sense.synset = ?
        `,
      )
      .all(synset);
    data[synset] = {
      senses: childSenses,
      link: text === lemma ? 'self' : 'part',
    };
  });

  const findRecurcive = (senses, depth = 0) => {
    senses.forEach(({ synset }) => {
      const synsSenses = db
        .prepare(
          `
          SELECT synlink.link, synlink.synset2 as synset FROM sense
            INNER JOIN word ON word.wordid = sense.wordid
            INNER JOIN synlink ON synlink.synset1 = sense.synset
            WHERE sense.lang = 'jpn'
              AND sense.synset = ?
          `,
        )
        .all(synset)
        .sort(() => Math.random() - 0.5);
      const filteredSynsSenses = [];
      synsSenses.forEach(({ link, ...s }) => {
        const childSenses = db
          .prepare(
            `
            SELECT sense.synset, word.lemma FROM sense
              INNER JOIN word ON word.wordid = sense.wordid
              WHERE sense.lang = 'jpn'
                AND sense.synset = ?
            `,
          )
          .all(s.synset);
        if (
          childSenses.length > 0 &&
          filteredSynsSenses.length < 5 &&
          !data[s.synset]
        ) {
          const sense = { synset: s.synset, senses: childSenses, link };
          filteredSynsSenses.push(sense);
          data[s.synset] = sense;
        }
      });
      if (filteredSynsSenses.length === 0 || depth > 1) return;
      findRecurcive(filteredSynsSenses, depth + 1);
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
