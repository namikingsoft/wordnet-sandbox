// @flow
import { spawn } from 'child_process';

type MecabStdioParam = {
  dicdir?: string,
  nbest?: number,
};

const mecabStdio = ({ dicdir, nbest }: MecabStdioParam = {}) => {
  const buffer = [];
  const args = ['-Ochasen'];
  if (dicdir) args.push(`-d${dicdir}`);
  if (nbest) args.push(`-N${nbest}`);
  const mecab = spawn('mecab', ['-Ochasen', '-d'], { detached: true });
  mecab.stdout.on('data', data => {
    buffer.push(String(data));
    console.log(String(data).split('\t'));
  });
  return str => {
    mecab.stdin.write(str.replace(/\n/g, ''));
    mecab.stdin.write('\n');
  };
};

const mecab = mecabStdio();
mecab('中居正広');
