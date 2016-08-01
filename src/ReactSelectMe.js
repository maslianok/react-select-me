/*
#react-select-me
===============================================
##Props
- Fast
- Scalable
- Debuggable
- Universal

##Features
- custom renderers
- CSS modules support
- direction to open
- isOpen support
- immutable data support
- virtualization


##Usage

##Properties:
===============================================
###options: Array

Description: list of dropdown options
Examples:
- List of primitives: `[1, 2]`
- List of objects: `[{value: 1, label: 'Label 1'}, {value: 2, label: 'Label 2'}]`

===============================================
###value: Any

Description: selected value
Examples:
- Primitive: `1`
- Object: `{value: 1, label: 'Label 1'}`
- Array of primitives for multiselect: `[1, 2]`
- Array of objects for multiselect: `[{value: 1, label: 'Label 1'}, {value: 2, label: 'Label 2'}]`

===============================================
###onChange: Function

Description: onChange callback. Return `false` to leave dropdown opened.
Arguments:
- `value: Array|Object|String|Number`: selected option (or array of options for multi select)
Example:
```javascript
onChange(value) {
  // handle new value
}
```

===============================================
###onSearch: Function

Description: onSearch callback. Calls on every search input change.
You have to process search string inside this function and filter your options based on your needs.
Arguments:
- `search: String`: search string
Example:
```javascript
onChange(value) {
  // handle new value
}
```

===============================================
###multiple: Bool
Description: multi-value dropdown

===============================================
###searchable: Bool
Description: ability to search (filter) options. `onSearch` function will be called

===============================================
###isOpen: Bool
Description: setting this property makes open / close functionality uncontrollable.
It always opened when isOpen === true and always closed when isOpen === false.
Setting this property to undefined returns component to usual behaviour.

===============================================
###selectedValueRenderer: Function

Description: function to render selected value
Arguments:
- `option: Object|String|Number`: option to render
- `onRemove: Function`: default function to remove value
Example:
```javascript
selectedValueRenderer(option, onRemove) {
  return <div style={{color: 'red'}}>{option.label}</div>;
}
```

===============================================
###selectedBlockRenderer: Function

Description: function to render block with selected options
Arguments:
- `selectedOptions: Array`: currently selected options
- `onRemove: Function`: default function to remove value
- `selectedValueRenderer: Function`: default function to render selected value
- `searchInputRenderer: Function`: default function to render search block
Example:
```javascript
selectedBlockRenderer(selectedOptions, onRemove) {
  return <div>{selectedOptions.map(option => option.label).join(', ')}</div>;
}
```

===============================================
###optionRenderer: Function

Description: function to render custom options
Arguments:
- `option: Object|String|Number`: option to render
- `selectedOptions: Array`: currently selected options
Example:
```javascript
optionRenderer(option, selectedOptions) {
  return <div style={{color: 'red'}}>{option.label}</div>;
}
```

===============================================
###listRenderer: Function

Description: function to render the list
Arguments:
- `options: Array`: list of options
- `selectedOptions: Array`: currently selected options
- `optionRenderer: Function`: default option renderer
- `onChange: Function`: default onChange callback
- `onToggleList: Function`: toggle list visibility
Example:
1. Simple
```javascript
listRenderer(options, selectedOptions, optionRenderer) {
  return <ul>{options.map(option => optionRenderer(option, selectedOptions))}</ul>;
}
```
2. Advanced
```javascript
listRenderer(options, selectedOptions, optionRenderer, onChange, onToggle) {
  return (
    <div className={s.listWrapper}>
      <div className={s.options}>
        {options.map(option => (
          <div className={s.option} onClick={onChange(option)} key={option.value}>
            <div style={{backgroundColor: option.color}} className={s.circle}></div>
            <div>{option.label}</div>
          </div>
        ))}
      </div>
      <div className={s.actions>
        <button className={s.btn} onClick={onToggle}>Save</button>
      </div>
    </div>
  );
}
```

===============================================
###iconRenderer: Function

Description: function to render custom icon.
Arguments:
- `isOpened: Bool`: whether the list opened

Example:
```javascript
iconRenderer(isOpened) {
  return <i className={isOpened ? 'icon-open' : 'icon-close'} />;
}
```

===============================================
###beforeOpen: Function

Description: before open handler. Return `false` to leave dropdown closed.
Arguments:
- `event: Object`: event

===============================================
###beforeClose: Function

Description: before close event. Return `false` to leave dropdown opened.

===============================================
###onOpen: Function

Description: handler for when the menu opens

===============================================
###onClose: Function

Description: handler for when the menu closes

===============================================
###listMaxHeight: Number

Description: Dropdown list max height in pixels. Default: `400`.

===============================================
###listPosition: String

Description: Dropdown list position. Default: `auto`.
Available values:
- `top`: expand to top
- `bottom`: expand to bottom
- `auto`: auto detection based on `wrapper` element

===============================================
###getWrapper: Function

Description: Function to get wrapper element.
Commonly you have to set this parameter if any of component's parents has `overflow: hidden` property.
This parameter affects to `listMaxHeight` and `listPosition` properties.

===============================================
###boundaryMargin: Number

Description: the minimal distance between screen / `wrapper` boundaries and dropdown list. Default: 6.

===============================================
###searchable: Bool

Description: ability to filter options

===============================================
###s: Object

Description: component classNames.
List of supported classes:
```javascript
{
  // wrapper
  dd__wrapper,
  // applied to multi select
  dd__multi,
  // applied to single select
  dd__single,
  // applied when dropdown opened
  dd__opened,
  // applied when dropdown has error property
  dd__error,
  // disabled
  dd_disabled: classType,
  // selected block class
  dd__selectControl,
  // selected values wrapper class
  dd__selected,
  // placeholder class
  dd__placeholder,
  // selected option class
  dd__selectedItem,
  // icon to remove selected value class
  dd__crossIcon,
  // list class
  dd__list,
  // virtualized list class
  dd__listVirtualized,
  // applied when select opens to bottom
  dd__openTobottom,
  // applied when select opens to top
  dd__openTotop,
  // dropdown option
  dd__option,
  // virtualized option class
  dd__optionVirtualized,
  // selected dropdown option
  dd__selectedOption,
}
```

Examples:
1. If you are using css modules you can import default styles directly to the component:
```javascript
import Select from 'react-select-me';
import s from 'react-select-me/styles.scss';
...
<Select s={s} {...otherProps} />
```

2. If you want to customize any element with help of your own classes
```javascript
const classNames = {
  // usual class names
  dd__wrapper: 'my-super-class',
  // or even with css modules
  dd__selectedOption: s.mySuperSelectedOption,
};
<Select s={classNames} {...otherProps} />
```
===============================================
###virtualized: Bool

Description: partly render list options using [react-virtualized](https://bvaughn.github.io/react-virtualized/).
Huge time to render boost on large datasets.
You have to set `optionHeight` property if your option height differs from default.

===============================================
###optionHeight: Number | Function

Default: 40
Description: option height. This property has to be set for virtualized lists,
because [react-virtualized](https://github.com/bvaughn/react-virtualized/blob/master/docs/VirtualScroll.md#prop-types)
has to know total options height to correctly display scroll.
It also used to calculate direction to open the list (in case of `direction="auto"`).

===============================================
###listHeight: Number

Description: when you set this property the list will always have the constant height despite
options length and available space. You have to set this property only when you are creating something like
horizontally scrolling lists or some other weird lists :) Otherwise, you probably need to `listMaxHeight`.

===============================================
###immutable: Bool

Description: parse data as [immutable](https://facebook.github.io/immutable-js/) lists.
When this property set to `true` you have to provide `options` and `value` as immutable objects.

*/

import React, { Component, PropTypes as T } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { VirtualScroll, AutoSizer } from 'react-virtualized';
import { fromJS } from 'immutable';
import cs from 'classnames';

const DEFAULT_LIST_POSITION = 'bottom';

export default class ReactSelectMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: props.isOpened === undefined ? false : props.isOpened,
    };

    this.ssr = typeof window === 'undefined';

    this.closeGlobal = this.closeGlobal.bind(this);
    this.skipEventPropagation = this.skipEventPropagation.bind(this);
    this.toImmutable = this.toImmutable.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.getOptionHeight = this.getOptionHeight.bind(this);
    this.getSelectedOptions = this.getSelectedOptions.bind(this);
    this.getListProps = this.getListProps.bind(this);
    this.getOffset = this.getOffset.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.renderSelectedBlock = this.renderSelectedBlock.bind(this);
    this.renderSearchInput = this.renderSearchInput.bind(this);
    this.renderSelectedItem = this.renderSelectedItem.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRemoveSelected = this.onRemoveSelected.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onSearch = this.onSearch.bind(this);

    if (props.value && props.multiple && !Array.isArray(props.value)) {
      this.warn('Invalid prop `value` supplied to `SelectComponent`, expected `array`.');
    }
  }

  /* ***************************************
  ************ Lifecycle events ************
  *****************************************/
  componentDidMount() {
    document.addEventListener('click', this.closeGlobal);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpened !== undefined && this.state.opened !== nextProps.isOpened) {
      this.setState({
        opened: nextProps.isOpened,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeGlobal);
  }

  /* ***************************************
  **************** Utils *******************
  *****************************************/
  warn(msg) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(msg); // eslint-disable-line no-console
    }
  }

  closeGlobal(e) {
    const { isOpened, beforeClose, onClose } = this.props;
    // @maslianok: when you decide to change this, please, keep in mind, that this case should work:
    // Open A -> Open B -> A should be closed
    if (this.skipPropagation || !this.state.opened) {
      this.skipPropagation = undefined;
      return;
    }

    if (!isOpened && beforeClose(e) !== false) {
      this.setState({ opened: false }, onClose);
    }
  }

  skipEventPropagation() {
    this.skipPropagation = true;
  }

  toImmutable(data) {
    const { immutable } = this.props;
    return immutable ? fromJS(data) : data;
  }
  /* ***************************************
  ************** Renderers *****************
  *****************************************/
  renderList() {
    const { listRenderer, virtualized, s } = this.props;

    if (!this.state.opened) {
      return undefined;
    }

    const options = this.getOptions();
    const selectedOptions = this.getSelectedOptions();

    if (typeof listRenderer === 'function') {
      return listRenderer(options, selectedOptions, this.renderOption, this.onChange, this.onToggle);
    }

    const { direction, calculatedListHeight } = this.getListProps();
    const listClasses = cs('dd__list', s.dd__list, `dd__openTo${direction}`, s[`dd__openTo${direction}`], {
      [s.dd__listVirtualized]: virtualized,
      dd__listVirtualized: virtualized,
    });

    if (virtualized) {
      const rowClassName = cs('dd__optionVirtualized', s.dd__optionVirtualized);
      const rowCount = options.length || options.size;
      return (
        <AutoSizer disableHeight>
          {({ width }) => (
            <VirtualScroll
              width={width}
              height={calculatedListHeight}
              rowHeight={this.getOptionHeight}
              rowCount={rowCount}
              className={listClasses}
              rowClassName={rowClassName}
              rowRenderer={({ index }) =>
                this.renderOption(this.getProp(options, index), selectedOptions)
              }
            />
          )}
        </AutoSizer>
      );
    }

    return (
      <div className={listClasses} style={{ maxHeight: `${calculatedListHeight}px` }}>
        {options.map(option => this.renderOption(option, selectedOptions))}
      </div>
    );
  }

  renderOption(option, selectedOptions) {
    const { valueKey, labelKey, optionRenderer, s } = this.props;
    const isSelected = selectedOptions.some(selected =>
      this.getProp(selected, valueKey) === this.getProp(option, valueKey)
    );
    const className = cs('dd__option', s.dd__option, {
      dd__selectedOption: isSelected,
      [s.dd__selectedOption]: isSelected,
    });

    const label = typeof optionRenderer === 'function' ?
      optionRenderer(option, selectedOptions) :
      <div className={className}>{this.getProp(option, labelKey)}</div>;

    return (
      <div key={this.getProp(option, valueKey)} onClick={this.onChange(option)}>
        {label}
      </div>
    );
  }

  renderSelectedBlock() {
    const { placeholder, searchable, multiple, s, selectedValueRenderer, selectedBlockRenderer } = this.props;
    const { opened } = this.state;
    const valueRenderer = selectedValueRenderer || this.renderSelectedItem;
    const selectedOptions = this.getSelectedOptions();

    if (selectedBlockRenderer) {
      return selectedBlockRenderer(selectedOptions, this.onChange, valueRenderer, this.renderSearchInput);
    }

    const selectedBlockClasses = cs('dd__selected', s.dd__selected);
    const placeholderClasses = cs('dd__placeholder', s.dd__placeholder);

    let selectedElements;
    if (selectedOptions.length && (multiple || !searchable || !opened)) {
      selectedElements = selectedOptions.map(option => valueRenderer(option, this.onChange));
    }

    return (
      <div className={selectedBlockClasses}>
        {selectedElements}
        {!selectedOptions.length && !searchable && <div className={placeholderClasses}>{placeholder}</div>}
        {searchable && this.renderSearchInput()}
      </div>
    );
  }

  renderSearchInput() {
    const { placeholder, s, searchInputRenderer } = this.props;
    const { searchString } = this.state;
    const selectedOptions = this.getSelectedOptions();
    const className = cs('dd__search', s.dd__search);

    if (typeof searchInputRenderer === 'function') {
      return searchInputRenderer(selectedOptions);
    }

    return (
      <div
        contentEditable
        tabIndex={0}
        className={className}
        onInput={this.onSearch}
        onKeyDown={this.onSearch}
        onFocus={this.onSearch}
        onClick={this.onSearch}
        placeholder={selectedOptions.length ? '' : placeholder}
        ref={e => (this.searchInput = e)}
      >
        {searchString}
      </div>
    );
  }

  renderSelectedItem(option) {
    const { valueKey, labelKey, multiple, s } = this.props;
    const selectedOptionClasses = cs('dd__selectedItem', s.dd__selectedItem);
    const crossIconClasses = cs('dd__crossIcon', s.dd__crossIcon);

    return (
      <div className={selectedOptionClasses} key={this.getProp(option, valueKey)}>
        <div>{this.getProp(option, labelKey)}</div>
        {multiple && <div className={crossIconClasses} onClick={this.onRemoveSelected(option)}>×</div>}
      </div>
    );
  }

  renderIcon() {
    const { iconRenderer, s } = this.props;
    const { opened } = this.state;
    if (typeof iconRenderer === 'function') {
      return iconRenderer(opened);
    }

    const className = cs('dd__expandIcon', s.dd__expandIcon);
    const path = 'M315,1318.04l-4.5,4.96-4.5-4.96,0.944-1.04,3.557,3.92,3.553-3.92,0.944,1.04m-9-5.08,4.5-4.96,4.5,4.96-0.944,1.04-3.557-3.92-3.553,3.92L306,1312.96'; // eslint-disable-line max-len
    return (
      <svg className={className} viewBox="0 0 9 15" width="9px" height="15px">
        <path d={path} transform="translate(-306 -1308)" />
      </svg>
    );
    /* eslint-enable */
  }

  /* ***************************************
  *************** Getters ******************
  *****************************************/
  getProp(option, key) {
    const { immutable } = this.props;
    return immutable ? option.get(key) : option[key];
  }

  getOptions() {
    const { options, labelKey, valueKey } = this.props;
    if (options && (options.length || options.size)) {
      // options are objects
      if (typeof this.getProp(options, 0) === 'object') {
        return options;
      }

      // options are strings or numbers
      return options.map(option => this.toImmutable({ [labelKey]: option, [valueKey]: option }));
    }

    // no options
    return [];
  }

  getSelectedOptions() {
    const { value, valueKey, multiple } = this.props;
    const options = this.getOptions();
    if (multiple) {
      if (value && (value.length || value.size)) {
        // options are objects
        if (typeof this.getProp(value, 0) === 'object') {
          return value;
        }
        return value.map(v => options.find(option => this.getProp(option, valueKey) === v));
      }

      return [];
    }

    const selectedOption = options.find(option => {
      const key = typeof value === 'object' ? this.getProp(value, valueKey) : value;
      return this.getProp(option, valueKey) === key;
    });

    return this.toImmutable(selectedOption ? [selectedOption] : []);
  }

  getListProps() {
    const { listHeight, listMaxHeight, listPosition, boundaryMargin, options } = this.props;
    let direction;

    if (this.ssr) {
      return {
        direction: DEFAULT_LIST_POSITION,
        calculatedListHeight: listHeight || listMaxHeight,
      };
    }

    let refinedHeight = 0;
    if (listHeight) {
      refinedHeight = listHeight;
    } else {
      const optionsCount = options.length || options.size;
      for (let i = 0; i < optionsCount; i++) {
        if (refinedHeight >= listMaxHeight) {
          refinedHeight = listMaxHeight;
          break;
        }
        refinedHeight += this.getOptionHeight({ index: i });
      }
    }

    const { top, bottom } = this.getOffset();
    if (listPosition === 'auto') {
      direction = bottom < refinedHeight + boundaryMargin && top > bottom ? 'top' : 'bottom';
    } else {
      direction = listPosition;
    }

    let calculatedListHeight;
    if (listHeight) {
      calculatedListHeight = listHeight;
    } else {
      const maxAvailableHeight = (direction === 'top' ? top : bottom) - boundaryMargin;
      calculatedListHeight = Math.min(maxAvailableHeight, refinedHeight);
    }

    return {
      direction,
      calculatedListHeight,
    };
  }

  getOffset() {
    if (this.ssr || !this.el) {
      return { top: 0, bottom: 0 };
    }

    const { getWrapper } = this.props;
    const wrapper = getWrapper();
    const rectEl = this.el.getBoundingClientRect();
    if (wrapper) {
      // calculate offsets based on wrapper position
      const rectWrapper = wrapper.getBoundingClientRect();
      return {
        top: rectEl.top - rectWrapper.top,
        bottom: rectWrapper.bottom - rectEl.bottom,
      };
    }

    // calculate offsets based on viewport
    const viewportHeight = window.document.documentElement.clientHeight;
    return { top: rectEl.top, bottom: viewportHeight - rectEl.bottom };
  }

  getOptionHeight({ index }) {
    const { optionHeight, options } = this.props;
    return typeof optionHeight === 'function' ? optionHeight(this.getProp(options, index)) : optionHeight;
  }
  /* ***************************************
  **************** Events ******************
  *****************************************/
  onChange(option) {
    return () => {
      const { multiple, immutable, onChange, valueKey } = this.props;
      let selectedValue;

      if (multiple) {
        // prepare values for multiselect
        const values = this.getSelectedOptions();
        const selectedIndex = values.findIndex(
          v => this.getProp(v, valueKey) === this.getProp(option, valueKey)
        );
        if (selectedIndex === -1) {
          // add new option to selected values
          selectedValue = immutable ? values.push(option) : [...values, option];
        } else {
          // remove option from selected values
          selectedValue = values.filter((v, i) => i !== selectedIndex);
        }
      } else {
        selectedValue = option;
      }

      if (onChange(selectedValue) === false) {
        this.skipEventPropagation();
      }
    };
  }

  onRemoveSelected(option) {
    return e => {
      this.skipEventPropagation();
      this.onChange(option)(e);
    };
  }

  onToggle(e) {
    if (this.skipPropagation) {
      return;
    }

    const {
      props: { searchable, beforeOpen, beforeClose, isOpened, onOpen, onClose },
      state: { opened },
    } = this;

    const nextState = isOpened !== undefined ? isOpened : !opened;
    const beforeFunc = nextState ? beforeOpen : beforeClose;

    if (nextState !== opened && beforeFunc(e) !== false) {
      const afterFunc = nextState ? onOpen : onClose;
      this.skipEventPropagation();
      if (searchable && this.searchInput) {
        if (nextState) {
          this.searchInput.focus();
        } else {
          this.searchInput.blur();
          window.getSelection().removeAllRanges();
        }
      }
      this.setState({ opened: nextState }, afterFunc);
    }
  }

  onSearch(evt) {
    if (!this.searchInput) {
      return;
    }

    if (!this.skipPropagation) {
      const { opened } = this.state;
      switch (evt.type) {
        case 'focus':
          // open dropdown onFocus
          if (!opened) {
            this.onToggle(evt);
            this.skipPropagation = undefined;
          }
          break;
        case 'click':
          // do not close dropdown onClick
          if (opened) {
            this.skipEventPropagation();
          }
          break;
        case 'keydown':
          // close dropdown on Tab keydown
          if (evt.nativeEvent.keyCode === 9 && opened) {
            // blur via Tab
            this.onToggle(evt);
            this.skipPropagation = undefined;
          }
          break;
        case 'input':
          // call filter function onInput
          const { onSearch } = this.props;
          const search = this.searchInput.innerHTML;
          if (onSearch && search !== this.lastSearch) {
            onSearch(search);
          }
          this.lastSearch = search;
          break;
        default:
          break;
      }
    }
  }
  /* ***************************************
  **************** Render ******************
  *****************************************/
  render() {
    const { error, multiple, disabled, s } = this.props;
    const { opened } = this.state;

    // classnames
    const wrapperClassnames = cs('dd__wrapper', s.dd__wrapper, {
      dd__opened: opened,
      dd__error: error,
      dd__multi: multiple,
      dd__disabled: disabled,
      [s.dd__opened]: opened,
      [s.dd__error]: error,
      [s.dd__multi]: multiple,
      [s.dd__disabled]: disabled,
    });
    const selectControlClasses = cs('dd__selectControl', s.dd__selectControl);
    const toggleHandler = disabled ? undefined : this.onToggle;

    return (
      <div className={wrapperClassnames}>
        <div className={selectControlClasses} onClick={toggleHandler} ref={el => (this.el = el)}>
          {this.renderSelectedBlock()}
          {this.renderIcon()}
        </div>
        {this.renderList()}
      </div>
    );
  }
}

ReactSelectMe.defaultProps = {
  optionHeight: 40,
  boundaryMargin: 8,
  listMaxHeight: 400,
  listPosition: 'auto',
  labelKey: 'label',
  valueKey: 'value',
  placeholder: 'Select ...',
  options: [],
  s: {},
  onChange: () => null,
  beforeOpen: () => true,
  beforeClose: () => true,
  onOpen: () => null,
  onClose: () => null,
  getWrapper: () => null,
};

const classType = T.oneOfType([T.string, T.array]);
ReactSelectMe.propTypes = {
  boundaryMargin: T.number,
  disabled: T.bool,
  error: T.bool,
  getWrapper: T.func,
  iconRenderer: T.func,
  immutable: T.bool,
  options: T.array,
  isOpened: T.bool,
  labelKey: T.string,
  listHeight: T.number,
  listMaxHeight: T.number,
  listPosition: T.oneOf(['top', 'bottom', 'auto']),
  listRenderer: T.func,
  multiple: T.bool,
  onChange: T.func.isRequired,
  onClose: T.func,
  onOpen: T.func,
  onSearch: T.func,
  beforeOpen: T.func,
  beforeClose: T.func,
  optionRenderer: T.func,
  placeholder: T.string,
  optionHeight: T.oneOfType([T.number, T.func]),
  s: T.shape({
    // wrapper
    dd__wrapper: classType,
    // applied to multi select
    dd__multi: classType,
    // applied to single select
    dd__single: classType,
    // applied when dropdown opened
    dd__opened: classType,
    // applied when dropdown has error property
    dd__error: classType,
    // disabled
    dd_disabled: classType,
    // selected block class
    dd__selectControl: classType,
    // selected values wrapper class
    dd__selected: classType,
    // placeholder class
    dd__placeholder: classType,
    // selected option class
    dd__selectedItem: classType,
    // icon to remove selected value class
    dd__crossIcon: classType,
    // list class
    dd__list: classType,
    // virtualized list class
    dd__listVirtualized: classType,
    // applied when select opens to bottom
    dd__openTobottom: classType,
    // applied when select opens to top
    dd__openTotop: classType,
    // dropdown option
    dd__option: classType,
    // virtualized option class
    dd__optionVirtualized: classType,
    // selected dropdown option
    dd__selectedOption: classType,
  }),
  searchable: T.bool,
  searchInputRenderer: T.func,
  selectedBlockRenderer: T.func,
  selectedValueRenderer: T.func,
  value: T.any,
  valueKey: T.string,
  virtualized: T.bool,
};
