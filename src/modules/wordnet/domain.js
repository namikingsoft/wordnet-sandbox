// @flow

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

export type Sense = {
  synset: Synset,
  lemma: string,
};

export type SearchedWordNet = {
  [Synset]: {
    senses: Sense[],
    link: string,
    linkNet: {
      [Synset]: string,
    },
  },
};

export const convertToForceData: SearchedWordNet => ForceData = searched => {
  const nodes = [];
  const links = [];
  const synsetIndexBySynset = {};
  Object.keys(searched).forEach(synset => {
    const { senses } = searched[synset];
    synsetIndexBySynset[synset] = nodes.length;
    nodes.push({ label: '', r: 20 + senses.length * 3 });
    senses.forEach(child => {
      links.push({ source: synsetIndexBySynset[synset], target: nodes.length });
      nodes.push({ label: child.lemma, r: 2 });
    });
  });
  const synsetLinkCache = {};
  Object.keys(searched).forEach(synset1 => {
    const { linkNet } = searched[synset1];
    Object.keys(linkNet).forEach(synset2 => {
      if (
        synset1 === synset2 ||
        synsetIndexBySynset[synset1] == null ||
        synsetIndexBySynset[synset2] == null ||
        (synsetLinkCache[synset2] && synsetLinkCache[synset2][synset1])
      )
        return;
      synsetLinkCache[synset1] = {};
      synsetLinkCache[synset1][synset2] = true;
      links.push({
        source: synsetIndexBySynset[synset1],
        target: synsetIndexBySynset[synset2],
        link: linkNet[synset2],
      });
    });
  });
  return { nodes, links };
};

export default convertToForceData;
