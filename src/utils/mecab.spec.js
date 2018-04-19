// @flow
import { mecabStdio } from './mecab';

describe('mecabStdio', () => {
  const mecab = {};

  beforeEach(() => {
    mecab.nbest1 = mecabStdio({ nbest: 1 });
    mecab.nbest2 = mecabStdio({ nbest: 2 });
  });

  afterEach(() => {
    Object.keys(mecab).forEach(x => {
      mecab[x].exit();
    });
  });

  it('should parse by nbest1', async () => {
    const morphes = await mecab.nbest1.parse('はじめまして阿部寛でし');
    expect(morphes).toEqual([
      {
        surface: 'はじめまして',
        reading: 'ハジメマシテ',
        basic: 'はじめまして',
        feature0: '感動詞',
        feature1: '',
        feature2: '',
        feature3: '',
        feature4: '',
        feature5: '',
        nbest: 1,
      },
      {
        surface: '阿部寛',
        reading: 'アベヒロシ',
        basic: '阿部寛',
        feature0: '名詞',
        feature1: '固有名詞',
        feature2: '人名',
        feature3: '一般',
        feature4: '',
        feature5: '',
        nbest: 1,
      },
      {
        surface: 'でし',
        reading: 'デシ',
        basic: 'です',
        feature0: '助動詞',
        feature1: '',
        feature2: '',
        feature3: '',
        feature4: '特殊・デス',
        feature5: '連用形',
        nbest: 1,
      },
    ]);
  });

  it('should parse by nbest2', async () => {
    const morphes = await mecab.nbest2.parse('中居正広');
    expect(morphes).toEqual([
      {
        surface: '中居正広',
        reading: 'ナカイマサヒロ',
        basic: '中居正広',
        feature0: '名詞',
        feature1: '固有名詞',
        feature2: '人名',
        feature3: '一般',
        feature4: '',
        feature5: '',
        nbest: 1,
      },
      {
        surface: '中居',
        reading: 'ナカイ',
        basic: '中居',
        feature0: '名詞',
        feature1: '固有名詞',
        feature2: '人名',
        feature3: '姓',
        feature4: '',
        feature5: '',
        nbest: 2,
      },
      {
        surface: '正広',
        reading: 'マサヒロ',
        basic: '正広',
        feature0: '名詞',
        feature1: '固有名詞',
        feature2: '人名',
        feature3: '名',
        feature4: '',
        feature5: '',
        nbest: 2,
      },
    ]);
  });

  it('should parse by nbest2 but find only one', async () => {
    const morphes = await mecab.nbest2.parse('卑猥');
    expect(morphes).toEqual([
      {
        surface: '卑猥',
        reading: 'ヒワイ',
        basic: '卑猥',
        feature0: '名詞',
        feature1: '形容動詞語幹',
        feature2: '',
        feature3: '',
        feature4: '',
        feature5: '',
        nbest: 1,
      },
    ]);
  });
});
