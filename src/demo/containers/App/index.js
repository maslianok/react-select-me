import React from 'react';
import cs from 'classnames';

import Select from '../../../ReactSelectMe';

import s from './styles.css';
import selectStyles from '../../../ReactSelectMe.css';

const colors = [
  { value: 1, label: 'Red', color: 'red' },
  { value: 2, label: 'Blue', color: 'blue' },
  { value: 3, label: 'Green', color: 'green' },
  { value: 4, label: 'Yellow', color: 'yellow' },
  { value: 5, label: 'Gray', color: 'gray' },
  { value: 6, label: 'Brown ', color: 'brown ' },
  { value: 7, label: 'Cyan', color: 'cyan' },
  { value: 8, label: 'Magenta', color: 'magenta' },
  { value: 9, label: 'Coral', color: 'coral' },
];

// const numOfRows = 2;
// const tonsOfOptions = Array.apply(null, Array(numOfRows)).map((n, i) => ({ value: i, label: `Value ${i}` }));

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: Array.apply(null, Array(20)),
    };

    this.onChange = this.onChange.bind(this);
    this.onChange3 = this.onChange3.bind(this);
    this.optionRenderer4 = this.optionRenderer4.bind(this);
  }

  onChange(index) {
    return value => {
      const { values } = this.state;
      this.setState({
        values: [
          ...values.slice(0, index),
          value,
          ...values.slice(index + 1),
        ],
      });
    };
  }

  // Example 1
  // Example 2

  // Example 3
  onChange3(value) {
    const { values } = this.state;
    const index = 3;
    this.setState({
      values: [
        ...values.slice(0, index),
        value,
        ...values.slice(index + 1),
      ],
    });

    return false;
  }

  // Example 4
  optionRenderer4(item, selectedItems) {
    const isSelected = selectedItems.some(selected => selected.value === item.value);
    const optionClassNames = cs(s.option, {
      [s.selected]: isSelected,
    });
    return (
      <div className={optionClassNames}>
        <div className={s.color} style={{ backgroundColor: item.color }} />
        <div className={s.value}>{item.label}</div>
      </div>
    );
  }

  render() {
    const { values } = this.state;
    return (
      <div className={s.page}>
        <h2 className={s.h2}>Dropdown examples</h2>

        <div className={`${s.example} ${s.example1}`}>
          <h3 className={s.h3}>Example 1. Default</h3>
          <div className={s.selectWrapper}>
            <Select
              options={colors}
              value={values[1]}
              s={selectStyles}
              onChange={this.onChange(1)}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example2}`}>
          <h3 className={s.h3}>Example 2. Multiple</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              options={colors}
              value={values[2]}
              s={selectStyles}
              onChange={this.onChange(2)}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example3}`}>
          <h3 className={s.h3}>Example 3. Don't close onChange.</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              options={colors}
              value={values[3]}
              s={selectStyles}
              onChange={this.onChange3}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example4}`}>
          <h3 className={s.h3}>Example 4. Custom option renderer.</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              options={colors}
              value={values[4]}
              s={selectStyles}
              onChange={this.onChange(4)}
              optionRenderer={this.optionRenderer4}
            />
          </div>
        </div>
      </div>
    );
  }
}
