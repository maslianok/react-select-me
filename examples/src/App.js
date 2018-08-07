import React, { Component } from 'react';
import cs from 'classnames';

import Select from 'react-select-me';
import makeVirtualized from 'react-select-me/lib/hoc/makeVirtualized';

import 'react-select-me/lib/ReactSelectMe.css';
import './index.css';

const VirtualizedSelect = makeVirtualized(Select);

const options = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'gray', label: 'Gray' },
  { value: 'brown ', label: 'Brown ' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'coral', label: 'Coral' },
];

const LINK = 'https://github.com/maslianok/react-select-me/';

const numOfRows = 2000;
const tonsOfOptions = [...Array(numOfRows)].map((n, i) => ({ value: i, label: `Value ${i}` }));

export default class App extends Component {
  constructor(props) {
    super(props);

    const checkboxProps = { checked: false, disabled: false };

    this.state = {
      checkboxes: {
        searchClearOnClose: {
          ...checkboxProps,
          checked: true,
          disabled: true,
        },
        dontCloseOnChange: checkboxProps,
        disabled: checkboxProps,
        iconRenderer: checkboxProps,
        isOpened: checkboxProps,
        listMaxHeight: checkboxProps,
        listPosition: checkboxProps,
        listRenderer: checkboxProps,
        multiple: checkboxProps,
        optionRenderer: checkboxProps,
        placeholder: checkboxProps,
        s: checkboxProps,
        searchable: checkboxProps,
        selectedBlockRenderer: checkboxProps,
        selectedValueRenderer: checkboxProps,
        value: checkboxProps,
        virtualized: checkboxProps,
      },
      onChange: this.onChange.bind(this),
      // s: selectStyles,
      options,
    };
  }

  getCheckboxFor = (name, label, anchor) => {
    const { checkboxes } = this.state;
    return (
      <div className="propItem">
        <input type="checkbox" {...checkboxes[name]} id={name} onChange={this.onPropChange(name)} />
        <label className="propsLabel" htmlFor={name}>
          {label}
          {anchor && (
            <a target="__blank" className="linkToApi" href={`${LINK}#${anchor}`}>
              [doc]
            </a>
          )}
        </label>
      </div>
    );
  };

  onPropChange = name => e => {
    const { checked } = e.target;

    const newState = {};
    newState.checkboxes = {
      ...this.state.checkboxes,
      [name]: {
        ...this.state.checkboxes[name],
        checked,
      },
    };

    switch (name) {
      case 'multiple':
        newState.value = undefined;
        newState[name] = checked;
        newState.checkboxes = {
          ...newState.checkboxes,
          value: {
            ...newState.checkboxes.value,
            checked: false,
          },
        };
        break;
      case 'searchable':
        newState[name] = checked;
        newState.onSearch = checked ? this.onSearch : undefined;
        newState.checkboxes = {
          ...newState.checkboxes,
          searchClearOnClose: {
            disabled: !checked,
            checked: true,
          },
        };
        break;
      case 'addNewItem':
        newState[name] = checked;
        newState.onAddNewItem = checked ? this.onAddNewItem : undefined;
        newState.searchable = true;
        newState.onSearch = this.onSearch;
        newState.checkboxes = {
          ...newState.checkboxes,
          searchable: {
            disabled: checked,
            checked: true,
          },
        };
        break;
      case 'virtualized':
        newState[name] = checked;
        newState.value = undefined;
        newState.options = checked ? tonsOfOptions : options;
        break;
      case 'searchClearOnClose':
        newState[name] = checked;
        break;
      case 'dontCloseOnChange':
        newState[name] = !checked;
        break;
      case 'disabled':
        newState[name] = checked;
        break;
      case 'iconRenderer':
        newState.iconRenderer = checked ? this.iconRenderer : undefined;
        break;
      case 'isOpened':
        newState[name] = checked ? true : undefined;
        break;
      case 'listMaxHeight':
        newState[name] = checked ? 200 : undefined;
        break;
      case 'listPosition':
        newState[name] = checked ? 'top' : undefined;
        break;
      case 'listRenderer':
        newState[name] = checked ? this[name] : undefined;
        newState.options = options;
        newState.value = undefined;
        newState.checkboxes = {
          ...newState.checkboxes,
          virtualized: {
            disabled: checked,
            checked: false,
          },
        };
        break;
      case 'optionRenderer':
        newState[name] = checked ? this[name] : undefined;
        newState.options = options;
        newState.value = undefined;
        newState.checkboxes = {
          ...newState.checkboxes,
          virtualized: {
            disabled: checked,
            checked: false,
          },
        };
        break;
      case 'placeholder':
        newState[name] = checked ? '🐍 Do not click there 🦃' : undefined;
        newState.value = checked ? undefined : this.state.value;
        break;
      case 's':
        break;
      case 'selectedBlockRenderer':
        newState[name] = checked ? this[name] : undefined;
        newState.options = options;
        newState.multiple = checked;
        newState.value = checked ? ['red', 'green', 'blue'] : undefined;
        newState.checkboxes = {
          ...newState.checkboxes,
          multiple: {
            checked,
          },
          searchable: {
            disabled: checked,
            checked: false,
          },
          virtualized: {
            disabled: checked,
            checked: false,
          },
          selectedValueRenderer: {
            disabled: checked,
            checked: false,
          },
        };
        break;
      case 'selectedValueRenderer':
        newState[name] = checked ? this.selectedValueRenderer : undefined;
        newState.options = options;
        newState.checkboxes = {
          ...newState.checkboxes,
          virtualized: {
            disabled: checked,
            checked: false,
          },
        };

        if (checked) {
          newState.value = this.state.multiple ? ['red', 'blue'] : 'red';
        }
        break;
      case 'value':
        const firstOption = this.state.options[0];
        if (!checked) {
          newState[name] = undefined;
          break;
        }

        newState[name] = this.state.multiple ? [firstOption] : firstOption;
        break;
      default:
        break;
    }

    this.setState(newState);
  };

  onChange = value => {
    this.setState({
      value,
    });

    return this.state.dontCloseOnChange;
  };

  onSearch = searchString => {
    const lowerString = searchString.toLowerCase();
    const currOptions = this.state.virtualized ? tonsOfOptions : options;
    this.setState({
      options: searchString ? currOptions.filter(o => o.label.toLowerCase().indexOf(lowerString) > -1) : currOptions,
    });
  };

  onAddNewItem = searchString => {
    const { virtualized, multiple } = this.state;
    const newOption = { value: searchString, label: searchString };
    if (virtualized) {
      tonsOfOptions.push(newOption);
    } else {
      options.push(newOption);
    }
    this.setState({
      value: multiple ? [...(this.state.value || []), newOption] : newOption,
    });
  };

  optionRenderer = (item, selectedItems) => {
    const isSelected = selectedItems.some(selected => selected.value === item.value);
    const optionClassNames = cs('customOption', {
      selected: isSelected,
    });
    return (
      <div className={optionClassNames}>
        <div className="color" style={{ backgroundColor: item.value }} />
        <div className="value">{item.label}</div>
      </div>
    );
  };

  listRenderer = (items, selectedOptions, optionRenderer, onChange, onToggle) => {
    const path = 'M564.985,578.822l1.089-1.1L572,584l-1,1ZM571,585l-1-1,11.926-14.015,1.089,1.1Z';
    return (
      <div className="customList">
        <div className="list">
          {items.map(item => {
            const isSelected = selectedOptions.some(el => el.value === item.value);
            const labelClasses = cs('label', {
              colorListLabelSelected: isSelected,
            });
            return (
              <div className="option" onClick={onChange(item)} key={item.value}>
                <div className="color" style={{ backgroundColor: item.value }}>
                  {isSelected && (
                    <div className="colorSelected">
                      <svg fill="#FFF" width="18px" height="15px">
                        <path d={path} transform="translate(-565 -570)" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className={labelClasses} style={{ color: isSelected ? item.value : '#1F2123' }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="actions">
          <button onClick={onToggle} className="choose">
            <span>Choose</span>
          </button>
        </div>
      </div>
    );
  };

  selectedBlockRenderer = selectedOptions => {
    if (!selectedOptions.length) {
      return <div className="selectedBlock">Select an option</div>;
    }

    const [firstOption, ...otherOptions] = selectedOptions;
    return (
      <div className="selectedBlock">
        <div className="value">{firstOption.label}</div>
        {!!otherOptions.length && <div className="counter">+{otherOptions.length}</div>}
      </div>
    );
  };

  iconRenderer = () => {
    const path =
      'M 10.95 1.71 C 10.95 1.71 6.71 5.95 6.71 5.95 C 6.32 6.34 5.68 6.34 5.29 5.95 C 5.29 5.95 1.05 1.71 1.05 1.71 C 0.66 1.32 0.66 0.68 1.05 0.29 C 1.44 -0.1 2.07 -0.1 2.46 0.29 C 2.46 0.29 6 3.83 6 3.83 C 6 3.83 9.54 0.29 9.54 0.29 C 9.93 -0.1 10.56 -0.1 10.95 0.29 C 11.34 0.68 11.34 1.32 10.95 1.71 Z'; // eslint-disable-line max-len
    return (
      <svg width="12px" height="7px">
        <path d={path} />
      </svg>
    );
  };

  selectedValueRenderer = item => (
    <div className="selectedOption" key={item.value}>
      <div className="selectedColor" style={{ backgroundColor: item.value }} />
      <div>{item.label}</div>
    </div>
  );

  render() {
    const { dontCloseOnChange, checkboxes, ...params } = this.state; // eslint-disable-line no-unused-vars
    return (
      <div>
        <div className="header">react-select-me</div>
        <ul className="menu">
          <li>
            <a href={LINK}>GitHub</a>
          </li>
        </ul>

        <div className="example">{params.virtualized ? <VirtualizedSelect {...params} /> : <Select {...params} />}</div>

        <div className="propsWraper">
          <div className="propsColumn">
            <div className="columnTitle">General</div>
            <div className="propsList">
              {this.getCheckboxFor('multiple', 'Multiple', 'multiple-bool')}
              {this.getCheckboxFor('searchable', 'Searchable', 'searchable-bool')}
              {this.getCheckboxFor('addNewItem', '"Add new" option')}
              {this.getCheckboxFor('virtualized', 'Virtualized (2k options)', 'virtualized-bool')}
            </div>
          </div>
          <div className="propsColumn">
            <div className="columnTitle">Renderers</div>
            <div className="propsList">
              {this.getCheckboxFor('iconRenderer', 'Icon renderer', 'iconrenderer-function')}
              {this.getCheckboxFor('optionRenderer', 'Option renderer', 'optionrenderer-function')}
              {this.getCheckboxFor(
                'selectedValueRenderer',
                'Selected value renderer',
                'selectedvaluerenderer-function',
              )}
              {this.getCheckboxFor(
                'selectedBlockRenderer',
                'Selected block renderer',
                'selectedblockrenderer-function',
              )}
            </div>
          </div>
          <div className="propsColumn">
            <div className="columnTitle">Other</div>
            <div className="propsList">
              {this.getCheckboxFor('dontCloseOnChange', 'Do not close on change')}
              {this.getCheckboxFor('disabled', 'Disabled')}
              {this.getCheckboxFor('placeholder', 'Set placeholder')}
              {this.getCheckboxFor('value', 'Choose first option', 'value-any')}
              {this.getCheckboxFor('isOpened', 'Always opened', 'isopen-bool')}
              {this.getCheckboxFor('listPosition', 'Opens to top', 'listposition-string')}
              {this.getCheckboxFor('listMaxHeight', 'List max height 100px', 'listmaxheight-number')}
              {this.getCheckboxFor('searchClearOnClose', 'Clear search on close', 'searchclearonclose-bool')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
