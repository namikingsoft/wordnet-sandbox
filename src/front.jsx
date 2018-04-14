// @flow
import * as React from 'react';
import { render } from 'react-dom';

import { App } from './containers/App';

render(
  <App />,
  (document.body &&
    document.body.appendChild(document.createElement('div')): any),
);
