// @flow
import * as React from 'react';

import { WordNetSvg } from '../containers/WordNetSvg';

type Props = {
  text: string,
  searchedWordNet: {},
  handleChangeText: Event => *,
  handleSubmit: Event => *,
};

export const Page = ({
  text,
  searchedWordNet,
  handleChangeText,
  handleSubmit,
}: Props) => (
  <div>
    <form onSubmit={handleSubmit}>
      <input type="text" value={text} onChange={handleChangeText} />
      <button>Search</button>
    </form>
    <WordNetSvg
      text={text}
      value={searchedWordNet}
      style={{
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        userSelect: 'none',
      }}
    />
    <div />
  </div>
);

export default Page;
