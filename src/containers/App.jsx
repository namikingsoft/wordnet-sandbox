// @flow
import { compose, withStateHandlers, mapProps } from 'recompose';
import { hot } from 'react-hot-loader';

import { didMount } from './highorders/lifecycle';
import { Page } from '../components/Page';

type InternalProps = {
  searchedWordNet: {},
  setSearchedWordNet: ({}) => *,
};

export const App = compose(
  hot(module),
  withStateHandlers(
    {
      searchedWordNet: null,
    },
    {
      setSearchedWordNet: () => searchedWordNet => ({ searchedWordNet }),
    },
  ),
  didMount(async ({ setSearchedWordNet }: InternalProps) => {
    const body = await window
      .fetch(
        `http://localhost:3000/wordnet/search?text=${encodeURIComponent(
          '卑猥',
        )}`,
        {
          method: 'GET',
        },
      )
      .then(res => res.json());
    setSearchedWordNet(body);
  }),
  mapProps(({ setValue, ...rest }) => rest),
)(Page);

export default App;
