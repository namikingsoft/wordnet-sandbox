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
    const { senses, link } = searched[synset];
    synsetIndexBySynset[synset] = nodes.length;
    nodes.push({ label: '', r: 20 + senses.length * 5, link });
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
        synsetLinkCache[`${synset1}=${synset2}`]
      )
        return;
      synsetLinkCache[`${synset1}=${synset2}`] = true;
      synsetLinkCache[`${synset2}=${synset1}`] = true;
      if (
        linkNet[synset2] === 'hype' ||
        linkNet[synset2] === 'holo' ||
        linkNet[synset2] === 'hmem' ||
        linkNet[synset2] === 'hsub' ||
        linkNet[synset2] === 'hprt' ||
        linkNet[synset2] === 'inst'
      ) {
        links.push({
          source: synsetIndexBySynset[synset2],
          target: synsetIndexBySynset[synset1],
          link: linkNet[synset2],
        });
      } else {
        links.push({
          source: synsetIndexBySynset[synset1],
          target: synsetIndexBySynset[synset2],
          link: linkNet[synset2],
        });
      }
    });
  });
  return { nodes, links };
};

export default convertToForceData;
