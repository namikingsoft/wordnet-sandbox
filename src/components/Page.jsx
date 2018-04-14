// @flow
import * as React from 'react';

import { WordNetSvg } from '../containers/WordNetSvg';

type Props = {
  searchedWordNet: {},
};

export const Page = ({ searchedWordNet }: Props) => (
  <div>
    <input type="text" />
    <WordNetSvg
      value={searchedWordNet}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
    <div />
  </div>
);

export default Page;
