import React from 'react';
import cs from 'classnames';

import Select from '../../../ReactSelectMe';

import s from './styles.css';
import selectStyles from '../../../ReactSelectMe.css';

const colors = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'gray', label: 'Gray' },
  { value: 'brown ', label: 'Brown ' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'coral', label: 'Coral' },
];

const numOfRows = 2000;
const tonsOfOptions = [...Array(numOfRows)].map((n, i) => ({ value: i, label: `Value ${i}` }));

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [...Array(20)],
      options4: colors,
    };

    this.onChange = this.onChange.bind(this);
    this.onSearch4 = this.onSearch4.bind(this);
    this.optionRenderer6 = this.optionRenderer6.bind(this);
  }

  onChange(index, dontClose) {
    return value => { // eslint-disable-line consistent-return
      const { values } = this.state;
      this.setState({
        values: [
          ...values.slice(0, index),
          value,
          ...values.slice(index + 1),
        ],
      });

      if (dontClose) {
        return false;
      }
    };
  }

  // Example 4
  onSearch4(searchString) {
    const lowerString = searchString.toLowerCase();
    this.setState({
      options4: searchString ?
        colors.filter(o => o.label.toLowerCase().indexOf(lowerString) > -1) :
        colors,
    });
  }

  // Example 6
  optionRenderer6(item, selectedItems) {
    const isSelected = selectedItems.some(selected => selected.value === item.value);
    const optionClassNames = cs(s.option, {
      [s.selected]: isSelected,
    });
    return (
      <div className={optionClassNames}>
        <div className={s.color} style={{ backgroundColor: item.value }} />
        <div className={s.value}>{item.label}</div>
      </div>
    );
  }

  // Example 7
  listRenderer7(items, selectedOptions, optionRenderer, onChange, onToggle) {
    const path = 'M564.985,578.822l1.089-1.1L572,584l-1,1ZM571,585l-1-1,11.926-14.015,1.089,1.1Z';
    return (
      <div className={s.wrapper}>
        <div className={s.list}>
          {items.map(item => {
            const isSelected = selectedOptions.some(el => el.value === item.value);
            const labelClasses = cs(s.label, {
              [s.colorListLabelSelected]: isSelected,
            });
            return (
              <div className={s.option} onClick={onChange(item)} key={item.value}>
                <div className={s.color} style={{ backgroundColor: item.value }}>
                {isSelected &&
                  <div className={s.colorSelected}>
                    <svg fill="#FFF" width="18px" height="15px">
                      <path d={path} transform="translate(-565 -570)" />
                    </svg>
                  </div>
                }
                </div>
                <div className={labelClasses} style={{ color: isSelected ? item.value : '#1F2123' }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className={s.actions}>
          <button onClick={onToggle} className={s.choose}>
            <span>Choose</span>
          </button>
        </div>
      </div>
    );
  }

  selectedBlockRenderer8(selectedOptions) {
    if (!selectedOptions.length) {
      return <div className={s.wrapper}>Select an option</div>;
    }

    const [firstOption, ...otherOptions] = selectedOptions;
    return (
      <div className={s.wrapper}>
        <div className={s.value}>{firstOption.label}</div>
        {!!otherOptions.length && <div className={s.counter}>+{otherOptions.length}</div>}
      </div>
    );
  }

  render() {
    const { values } = this.state;
    return (
      <div className={s.page}>
        <h2 className={s.h2}>Dropdown examples</h2>

        <div className={`${s.example} ${s.example1}`}>
          <h3 className={s.h3}>Default</h3>
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
          <h3 className={s.h3}>Multiple</h3>
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
          <h3 className={s.h3}>Don't close onChange.</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              options={colors}
              value={values[3]}
              s={selectStyles}
              onChange={this.onChange(3, true)}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example4}`}>
          <h3 className={s.h3}>Searchable.</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              searchable
              options={this.state.options4}
              value={values[4]}
              s={selectStyles}
              onChange={this.onChange(4)}
              onSearch={this.onSearch4}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example5}`}>
          <h3 className={s.h3}>2k options (virtualized)</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              virtualized
              options={tonsOfOptions}
              value={values[5]}
              s={selectStyles}
              onChange={this.onChange(5)}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example6}`}>
          <h3 className={s.h3}>Custom option renderer.</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              options={colors}
              value={values[6]}
              s={selectStyles}
              onChange={this.onChange(6)}
              optionRenderer={this.optionRenderer6}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example7}`}>
          <h3 className={s.h3}>Custom list renderer.</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              options={colors}
              value={values[7]}
              s={selectStyles}
              onChange={this.onChange(7, true)}
              listRenderer={this.listRenderer7}
            />
          </div>
        </div>

        <div className={`${s.example} ${s.example8}`}>
          <h3 className={s.h3}>Custom selected block renderer.</h3>
          <div className={s.selectWrapper}>
            <Select
              multiple
              options={colors}
              value={values[8]}
              s={selectStyles}
              onChange={this.onChange(8, true)}
              selectedBlockRenderer={this.selectedBlockRenderer8}
            />
          </div>
        </div>
      </div>
    );
  }
}
