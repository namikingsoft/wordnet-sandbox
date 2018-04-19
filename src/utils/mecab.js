// @flow
import { spawn } from 'child_process';

type MecabMorpheme = {
  surface: string,
  reading: string,
  basic: string,
  feature0: string,
  feature1: string,
  feature2: string,
  feature3: string,
  feature4: string,
  feature5: string,
  nbest: number,
};

type MecabStdioParam = {
  dicdir?: string,
  nbest?: number,
  pollingMsec?: number,
  timeoutMsec?: number,
};

type MecabStdioInstance = {
  exit: void => void,
  parse: string => Promise<MecabMorpheme[]>,
};

const eosLabel = 'EOS';
const eonLabel = 'EON';

export const mecabStdio: MecabStdioParam => MecabStdioInstance = ({
  dicdir,
  nbest = 1,
  pollingMsec = 100,
  timeoutMsec = 10000,
} = {}) => {
  const lines = [];
  const args = [
    `-E${eosLabel}\n`,
    `-S${eonLabel}\n`,
    `-N${nbest}`,
    '-F%M,%H\n',
  ];
  if (dicdir) args.push(`-d${dicdir}`);
  const mecab = spawn('mecab', args, { detached: true });
  mecab.stdout.on('data', data => {
    Array.prototype.push.apply(lines, String(data).split('\n'));
  });
  return {
    exit: () => mecab.kill(),
    parse: (str: string) =>
      new Promise((resolve, reject) => {
        mecab.stdin.write(`${str.replace(/\n/g, ' ')}\n`);
        const maxCount = Math.floor(timeoutMsec / pollingMsec);
        const check = count => {
          if (count >= maxCount) return reject(new Error('timeout'));
          const isFinished =
            !!lines.find(x => x.indexOf(eonLabel) > -1) ||
            (nbest === 1 && lines.find(x => x.indexOf(eosLabel) > -1));
          if (isFinished) {
            return resolve(
              lines
                .splice(0, lines.length)
                .filter(x => !!x && x !== eonLabel)
                .map(x => x.slice(0, 1) + x.slice(1).replace(/,/g, '\t'))
                .map(x => x.slice(0, 1) + x.slice(1).replace(/\*/g, ''))
                .reduce(
                  ({ results, nbestCount }, x) =>
                    x.indexOf(eosLabel) > -1
                      ? {
                          results,
                          nbestCount: nbestCount + 1,
                        }
                      : {
                          results: [...results, `${nbestCount}\t${x}`],
                          nbestCount,
                        },
                  { results: [], nbestCount: 1 },
                )
                .results.map(x => x.split('\t'))
                .map(
                  ([
                    nbestCount,
                    surface,
                    feature0,
                    feature1,
                    feature2,
                    feature3,
                    feature4,
                    feature5,
                    basic,
                    reading,
                  ]) => ({
                    nbest: Number(nbestCount),
                    surface,
                    feature0,
                    feature1,
                    feature2,
                    feature3,
                    feature4,
                    feature5,
                    basic,
                    reading,
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

export default mecabStdio;
