// @flow
import { compose, withHandlers, withStateHandlers, mapProps } from 'recompose';
import { hot } from 'react-hot-loader';

import { didMount } from './highorders/lifecycle';
import { Page } from '../components/Page';
import { type SearchedWordNet } from '../modules/wordnet/domain';

type InternalProps = {
  searchedWordNet: ?SearchedWordNet,
  setSearchedWordNet: (?SearchedWordNet) => *,
  loading: boolean,
  setLoading: boolean => *,
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
      loading: false,
      text: '',
    },
    {
      setSearchedWordNet: () => searchedWordNet => ({ searchedWordNet }),
      setLoading: () => loading => ({ loading }),
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
  didMount(
    ({
      changeText,
      setSearchedWordNet,
      setLoading,
      loading,
    }: InternalProps) => {
      const handleChangeHash = async () => {
        if (loading) return;
        const text =
          window.location.hash &&
          decodeURIComponent(window.location.hash.slice(1));
        if (text) {
          document.title = text;
          changeText(text);
          setSearchedWordNet(null);
          setLoading(true);
          const body = await window
            .fetch(
              `http://localhost:3000/wordnet/search?text=${encodeURIComponent(
                text,
              )}`,
            )
            .then(res => res.json());
          setSearchedWordNet(body);
          setLoading(false);
        }
      };
      window.onpopstate = handleChangeHash;
      handleChangeHash();
    },
  ),
  mapProps(({ changeText, setSearchedWordNet, setLoading, ...rest }) => rest),
)(Page);

export default App;
