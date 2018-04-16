// @flow
import { compose, withHandlers, withStateHandlers, mapProps } from 'recompose';
import { hot } from 'react-hot-loader';

import { didMount } from './highorders/lifecycle';
import { Page } from '../components/Page';
import { type SearchedWordNet } from '../modules/wordnet/domain';

type InternalProps = {
  searchedWordNet: ?SearchedWordNet,
  setSearchedWordNet: (?SearchedWordNet) => *,
  handleChangeText: Event => *,
  handleSubmit: Event => *,
  text: string,
  changeText: string => *,
  searchText: string => *,
};

export const App = compose(
  hot(module),
  withStateHandlers(
    {
      searchedWordNet: null,
      text: '',
    },
    {
      setSearchedWordNet: () => searchedWordNet => ({ searchedWordNet }),
      changeText: () => text => ({ text }),
    },
  ),
  withHandlers({
    handleChangeText: ({ changeText }: InternalProps) => event => {
      changeText(event.target.value);
    },
    handleSubmit: ({
      text,
      setSearchedWordNet,
    }: InternalProps) => async event => {
      if (event) event.preventDefault();
      setSearchedWordNet(null);
      const body = await window
        .fetch(
          `http://localhost:3000/wordnet/search?text=${encodeURIComponent(
            text,
          )}`,
        )
        .then(res => res.json());
      setSearchedWordNet(body);
    },
  }),
  withHandlers({
    searchText: ({ changeText, handleSubmit }: InternalProps) => async text => {
      changeText(text);
      await new Promise(resolve => setTimeout(resolve, 100)); // TODO
      handleSubmit(window.event);
    },
  }),
  didMount(({ searchText }: InternalProps) => {
    // TODO
    // searchText('正しさ');
    // searchText('鉄砲');
    // searchText('風邪');
    searchText('障害');
  }),
  mapProps(({ changeText, setSearchedWordNet, ...rest }) => rest),
)(Page);

export default App;
