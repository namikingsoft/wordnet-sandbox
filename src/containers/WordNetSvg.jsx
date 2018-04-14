// @flow
import * as React from 'react';
import { compose, withHandlers, withStateHandlers, mapProps } from 'recompose';
import * as d3 from 'd3';

import { didMount, didUpdate, willUnmount } from './highorders/lifecycle';
import {
  convertToForceData,
  type SearchedWordNet,
} from '../modules/wordnet/domain';
import { Svg } from '../components/Svg';

type Rect = {
  width: number,
  height: number,
};

type Props = {
  value: ?SearchedWordNet,
};

type InternalProps = {
  element: ?React$ElementRef<*>,
  setElement: (React$ElementRef<*>) => *,
  rect: Rect,
  setRect: Rect => *,
  handleResize: void => *,
  ...$Exact<Props>,
};

export const WordNetSvg: React.ComponentType<Props> = compose(
  withStateHandlers(
    {
      element: null,
      rect: { width: 0, height: 0 },
    },
    {
      setElement: () => element => ({ element }),
      setRect: () => rect => ({ rect }),
    },
  ),
  withHandlers({
    handleResize: ({ element, setRect }: InternalProps) => () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setRect(rect);
    },
  }),
  didMount(({ handleResize }: InternalProps) => {
    window.addEventListener('resize', handleResize);
  }),
  willUnmount(({ handleResize }: InternalProps) => {
    window.removeEventListener('resize', handleResize);
  }),
  didUpdate(
    (
      { value, element, rect: { width, height }, handleResize }: InternalProps,
      prev,
    ) => {
      if (element && element !== prev.element) {
        handleResize();
      }
      if (value && value !== prev.value) {
        const svg = d3.select(element);
        const { nodes, links } = convertToForceData(value);
        const simulation = d3
          .forceSimulation()
          .force('link', d3.forceLink().id(d => d.index))
          .force('collide', d3.forceCollide(d => d.r + 8).iterations(16))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('y', d3.forceY(0))
          .force('x', d3.forceX(0));

        const link = svg
          .append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(links)
          .enter()
          .append('line')
          .attr('stroke', 'black');

        const node = svg
          .append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(nodes)
          .enter()
          .append('circle')
          .attr('r', d => d.r)
          .call(
            /* eslint-disable no-param-reassign */
            d3
              .drag()
              .on('start', d => {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
              })
              .on('drag', d => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
              })
              .on('end', d => {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
              }),
            /* eslint-enable no-param-reassign */
          );

        const ticked = () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node.attr('cx', d => d.x).attr('cy', d => d.y);
        };

        simulation.nodes(nodes).on('tick', ticked);

        simulation.force('link').links(links);
      }
    },
  ),
  mapProps(({ element, rect, setRect, handleResize, ...rest }) => ({
    ...rest,
  })),
)(Svg);

export default WordNetSvg;
