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

export const mecabStdio: MecabStdioParam => MecabStdioInstance = ({
  dicdir,
  nbest = 1,
  pollingMsec = 100,
  timeoutMsec = 10000,
} = {}) => {
  const lines = [];
  const args = [
    `-E${eosLabel}\n`,
    `-N${nbest}`,
    '-F%M\t%f[7]\t%f[6]\t%f[0]\t%f[1]\t%f[2]\t%f[3]\t%f[4]\t%f[5]\n',
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
                .filter(x => !!x)
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

export default mecabStdio;
