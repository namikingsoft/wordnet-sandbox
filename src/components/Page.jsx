// @flow
import * as React from 'react';

import { WordNetSvg } from '../containers/WordNetSvg';

type Props = {
  searchedWordNet: {},
  handleChangeText: Event => *,
  handleSubmit: Event => *,
};

export const Page = ({
  searchedWordNet,
  handleChangeText,
  handleSubmit,
}: Props) => (
  <div>
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChangeText} />
      <button>Search</button>
    </form>
    <WordNetSvg
      value={searchedWordNet}
      style={{
        position: 'fixed',
        zIndex: -1,
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
