import App from '../index';

import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

describe('<CategoriesCollection />', () => {
  it('should render the div', () => {
    const renderedComponent = shallow(<App />);
    expect(renderedComponent.type()).toEqual('div');
  });
});
