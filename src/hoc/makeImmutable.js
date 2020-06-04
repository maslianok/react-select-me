import React, { Component } from 'react';
import { fromJS } from 'immutable';

const makeImmutable = (ReactSelectMe) =>
  class ReactSelectMeHOC extends Component {
    toImmutable = (data) => fromJS(data);

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ReactSelectMe {...this.props} toImmutable={this.toImmutable} immutable />;
    }
  };

export default makeImmutable;
