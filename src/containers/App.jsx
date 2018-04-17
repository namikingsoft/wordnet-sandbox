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
    handleSubmit: ({ text }: InternalProps) => async event => {
      event.preventDefault();
      window.location.hash = `#${text}`;
    },
  }),
  didMount(({ changeText, setSearchedWordNet }: InternalProps) => {
    // TODO
    // searchText('正しさ');
    // searchText('鉄砲');
    // searchText('障害');
    // searchText('風邪');
    const handleChangeHash = async event => {
      console.log(event);
      const text =
        window.location.hash &&
        decodeURIComponent(window.location.hash.slice(1));
      if (text) {
        changeText(text);
        await new Promise(resolve => setTimeout(resolve, 100)); // TODO
        setSearchedWordNet(null);
        const body = await window
          .fetch(
            `http://localhost:3000/wordnet/search?text=${encodeURIComponent(
              text,
            )}`,
          )
          .then(res => res.json());
        setSearchedWordNet(body);
      }
    };
    window.onpopstate = handleChangeHash;
    handleChangeHash();
  }),
  mapProps(({ changeText, setSearchedWordNet, ...rest }) => rest),
)(Page);

export default App;
