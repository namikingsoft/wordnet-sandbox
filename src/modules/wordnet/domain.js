// @flow
import * as d3 from 'd3';

type Node = {
  label: string,
  r: number,
};

type Link = {
  source: number,
  target: number,
};

type ForceData = {
  nodes: Node[],
  links: Link[],
};

export type Synset = string;

export type WordNet = {
  synset: Synset,
  lemma: string,
  link: string,
};

export type SearchedWordNet = { [Synset]: WordNet };

export const convertToForceData: SearchedWordNet => ForceData = searched => {
  const range = 100;
  return {
    /* eslint-disable no-bitwise */
    nodes: d3
      .range(0, range)
      .map(d => ({ label: `l${d}`, r: ~~d3.randomUniform(8, 28)() })),
    links: d3.range(0, range).map(() => ({
      source: ~~d3.randomUniform(range)(),
      target: ~~d3.randomUniform(range)(),
    })),
    /* eslint-enable no-bitwise */
  };
};

export default convertToForceData;
