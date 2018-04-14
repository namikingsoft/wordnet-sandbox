// @flow
import * as React from 'react';

/* eslint-disable immutable/no-this, react/no-multi-comp */

type LifecycleFunction<TProps: {}, TState: {} = *> = (
  TProps,
  TProps,
  ?TState,
) => *;

type DerivedStateFromPropsFunction<TProps: {}, TState: {} = *> = (
  TProps,
  TState,
) => TState | void;

/* eslint-disable prettier/prettier */
export const didMount:
  <T: {}>(LifecycleFunction<T>) => React.ComponentType<T> => React.ComponentType<T>
= (f => BaseComponent => {
  /* eslint-enable prettier/prettier */
  class EnhancedComponent extends React.Component<*> {
    componentDidMount() {
      f(this.props);
    }
    render() {
      return React.createFactory(BaseComponent)({
        ...this.props,
        ...this.state,
      });
    }
  }
  return EnhancedComponent;
}: any);

/* eslint-disable prettier/prettier */
export const didUpdate:
  <T: {}>(LifecycleFunction<T>) => React.ComponentType<T> => React.ComponentType<T>
= (f => BaseComponent => {
  /* eslint-enable prettier/prettier */
  class EnhancedComponent extends React.Component<*> {
    componentDidUpdate(prevProps, prevState) {
      f(this.props, prevProps, prevState);
    }
    render() {
      return React.createFactory(BaseComponent)({
        ...this.props,
        ...this.state,
      });
    }
  }
  return EnhancedComponent;
}: any);

/* eslint-disable prettier/prettier */
export const willUnmount:
  <T: {}>(LifecycleFunction<T>) => React.ComponentType<T> => React.ComponentType<T>
= (f => BaseComponent => {
  /* eslint-enable prettier/prettier */
  class EnhancedComponent extends React.Component<*> {
    componentWillUnmount(prevProps, prevState) {
      f(this.props, prevProps, prevState);
    }
    render() {
      return React.createFactory(BaseComponent)({
        ...this.props,
        ...this.state,
      });
    }
  }
  return EnhancedComponent;
}: any);

/* eslint-disable prettier/prettier */
export const getDerivedStateFromProps:
  <T: {}>(DerivedStateFromPropsFunction<T>) => React.ComponentType<T> => React.ComponentType<T>
= (f => BaseComponent => {
  /* eslint-enable prettier/prettier */
  class EnhancedComponent extends React.Component<*, *> {
    static getDerivedStateFromProps(nextProps, prevState) {
      return f(nextProps, prevState) || null;
    }
    state = {};
    render() {
      return React.createFactory(BaseComponent)({
        ...this.props,
        ...this.state,
      });
    }
  }
  return EnhancedComponent;
}: any);
