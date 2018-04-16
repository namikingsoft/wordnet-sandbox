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

type Props = {
  text: string,
  value: ?SearchedWordNet,
};

type InternalProps = {
  element: ?React$ElementRef<*>,
  setElement: (React$ElementRef<*>) => *,
  handleResize: void => *,
  searchText: string => *,
  ...$Exact<Props>,
};

export const WordNetSvg: React.ComponentType<Props> = compose(
  withStateHandlers(
    {
      element: null,
    },
    {
      setElement: () => element => ({ element }),
    },
  ),
  withHandlers({
    handleResize: ({ element }: InternalProps) => () => {
      if (!element) return;
      const svg = d3.select(element);
      const box = element.getBoundingClientRect();
      let viewX = 0;
      let viewY = 0;
      let viewWidth = box.width;
      let viewHeight = box.height;
      const zoomper = 100;
      const translate = () => {
        const scale = 100 / zoomper;
        const viewWidthPre = viewWidth;
        const viewHeightPre = viewHeight;
        viewWidth = box.width * scale;
        viewHeight = box.height * scale;
        viewX += (viewWidthPre - viewWidth) / 2;
        viewY += (viewHeightPre - viewHeight) / 2;
        svg.attr('viewBox', `${viewX} ${viewY} ${viewWidth} ${viewHeight}`);
      };
      const drag = d3.drag().on('drag', () => {
        viewX -= d3.event.dx;
        viewY -= d3.event.dy;
        translate();
      });
      const zoom = d3.zoom().on('zoom', () => {
        viewX += d3.event.sourceEvent.deltaX;
        viewY += d3.event.sourceEvent.deltaY;
        translate();
      });
      svg.call(drag).call(zoom);
      translate();
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
      { text, value, element, handleResize, searchText }: InternalProps,
      prev,
    ) => {
      if (element && element !== prev.element) {
        handleResize();
      }
      if (element && value && value !== prev.value) {
        const { width, height } = element.getBoundingClientRect();
        const svg = d3.select(element);
        svg.selectAll('*').remove();
        const { nodes, links } = convertToForceData(value);
        const simulation = d3.forceSimulation();

        svg
          .append('defs')
          .append('marker')
          .attr('id', 'arrowstart')
          .attr('refX', -30)
          .attr('refY', 4)
          .attr('markerWidth', 10)
          .attr('markerHeight', 10)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M 0,0 V 8 L8,4 Z')
          .attr('fill', 'steelblue');

        svg
          .append('defs')
          .append('marker')
          .attr('id', 'arrowend')
          .attr('refX', 30)
          .attr('refY', 4)
          .attr('markerWidth', 10)
          .attr('markerHeight', 10)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M 0,0 V 8 L8,4 Z')
          .attr('fill', 'steelblue');

        const line = svg
          .append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(links)
          .enter()
          .append('line')
          .attr('stroke', d => {
            if (!d.link) return '#eee';
            switch (d.link) {
              case 'hype':
              case 'hypo':
                return 'steelblue';
              default:
                return '#aaa';
            }
          })
          .attr(
            'marker-start',
            d =>
              d.link && (d.link === 'hype' || d.link === 'hypo')
                ? 'url(#arrowstart)'
                : null,
          )
          .attr(
            'marker-end',
            d =>
              d.link && (d.link === 'hype' || d.link === 'hypo')
                ? 'url(#arrowend)'
                : null,
          )
          .attr('stroke-dasharray', d => (d.link ? '5, 5' : null))
          .attr('stroke-width', d => (d.link === 'sim' ? 2 : 1));

        const node = svg
          .selectAll('g.nodes')
          .data(nodes)
          .enter()
          .append('g')
          .attr('class', 'nodes');

        node
          .append('circle')
          .attr('r', d => d.r)
          .style('fill', d => {
            if (d.label) return 'black';
            if (d.link === 'self') return 'steelblue';
            return '#ccc';
          })
          // .style('stroke', d => (d.label ? 'black' : '#999'))
          // .style('stroke-width', 1)
          .style('opacity', d => (d.label ? 1 : 0.3))
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

        node
          .append('text')
          .attr('dx', 7)
          .attr('dy', '.35em')
          .text(d => d.label)
          .style(
            'font-size',
            d => (d.label.indexOf(text) > -1 ? '1.6em' : '0.75em'),
          );

        const ticked = () => {
          line
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node
            .selectAll('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

          node
            .selectAll('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .style('cursor', 'pointer')
            .on('click', d => {
              if (d.label) searchText(d.label);
            });
        };

        simulation.nodes(nodes).on('tick', ticked);
        simulation
          .velocityDecay(0.5)
          .force('link', d3.forceLink().id(d => d.index))
          .force('collide', d3.forceCollide(d => d.r + 12).iterations(16))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('y', d3.forceY(0))
          .force('x', d3.forceX(0));
        simulation
          .force('link')
          .links(links)
          .distance(() => 50)
          .strength(() => 2);
        simulation.force('charge').strength(() => -175);
      }
    },
  ),
  mapProps(({ element, handleResize, searchText, ...rest }) => ({
    ...rest,
  })),
)(Svg);

export default WordNetSvg;
