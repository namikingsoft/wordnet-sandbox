// @flow
import { spawn } from 'child_process';
import Database from 'better-sqlite3';

type MecabStdioParam = {
  dicdir?: string,
  nbest?: number,
  pollingMsec?: number,
  timeoutMsec?: number,
};

const eosLabel = 'EOS';

const mecabStdio = ({
  dicdir,
  nbest = 1,
  pollingMsec = 100,
  timeoutMsec = 10000,
}: MecabStdioParam = {}) => {
  const lines = [];
  const args = [
    `-E${eosLabel}`,
    `-N${nbest}\n`,
    '-F%M\t%f[7]\t%f[6]\t%f[0]\t%f[1]\t%f[2]\t%f[3]\t%f[4]\t%f[5]\n',
  ];
  if (dicdir) args.push(`-d${dicdir}`);
  const mecab = spawn('mecab', args, { detached: true });
  mecab.stdout.on('data', data => {
    Array.prototype.push.apply(lines, String(data).split('\n'));
  });
  return {
    exit: () => mecab.kill(),
    parse: str =>
      new Promise((resolve, reject) => {
        mecab.stdin.write(str.replace(/\n/g, ' '));
        mecab.stdin.write('\n');
        const maxCount = Math.floor(timeoutMsec / pollingMsec);
        const check = count => {
          if (count >= maxCount) return reject(new Error('timeout'));
          const eosNum = lines.reduce(
            (acc, x) => acc + (x.indexOf(eosLabel) > -1 ? 1 : 0),
            0,
          );
          if (eosNum === nbest) {
            return resolve(
              lines
                .reduce(
                  ({ results, nbestCount }, x) =>
                    x.indexOf(eosLabel) > -1
                      ? {
                          results,
                          nbestCount: nbestCount + 1,
                        }
                      : {
                          results: [...results, `${x}\t${nbestCount}`],
                          nbestCount,
                        },
                  { results: [], nbestCount: 1 },
                )
                .results.map(x => x.split('\t'))
                .map(
                  ([
                    surface,
                    reading,
                    basic,
                    feature0,
                    feature1,
                    feature2,
                    feature3,
                    feature4,
                    feature5,
                    nbestCount,
                  ]) => ({
                    surface,
                    reading,
                    basic,
                    feature0,
                    feature1,
                    feature2,
                    feature3,
                    feature4,
                    feature5,
                    nbest: Number(nbestCount),
                  }),
                ),
            );
          }
          return setTimeout(() => check(count + 1), pollingMsec);
        };
        check(0);
      }),
  };
};

// const mecab = mecabStdio({ nbest: 1 });
// mecab.parse('似つかわしげ').then(xs => {
//   console.log(xs);
//   mecab.exit();
// });
const db = new Database('/resources/wnjpn.db');
const senses = db
  .prepare(
    `
    SELECT sense.synset, word.lemma FROM sense
      INNER JOIN word ON word.wordid = sense.wordid
      WHERE word.lemma LIKE ?
      ORDER BY sense.synset ASC
  `,
  )
  .all('%淫乱%');
console.log(senses);

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
  console.log(childSenses);
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
    if (childSenses.length > 0) console.log(link, childSenses);
  });
});
