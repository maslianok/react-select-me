import { shallow } from 'enzyme';
import React from 'react';

import App from '../index';

describe('<App />', () => {
  it('should render the div', () => {
    const renderedComponent = shallow(<App />);
    expect(renderedComponent.type()).toEqual('div');
  });
});
