import React, { Component } from 'react';
import { fromJS } from 'immutable';

const makeImmutable = ReactSelectMe =>
  class ReactSelectMeHOC extends Component {
    toImmutable = data => fromJS(data);
    render() {
      return <ReactSelectMe {...this.props} toImmutable={this.toImmutable} immutable />;
    }
  };

export default makeImmutable;
