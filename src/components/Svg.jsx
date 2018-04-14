// @flow
import * as React from 'react';

type Props = {
  setElement: (React$ElementRef<*>) => *,
};

export const Svg = ({ setElement, ...rest }: Props) => (
  <svg ref={setElement} {...rest} />
);

export default Svg;
