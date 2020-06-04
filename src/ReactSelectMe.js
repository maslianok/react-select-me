// @TODO
// hot keys: select option on Enter, remove on Backspcae, highlight etc
// disable option

import React, { PureComponent } from 'react';

import cs from 'classnames';

import { defaultProps, propTypes } from './propsDefinitions';

const DEFAULT_LIST_POSITION = 'bottom';

export default class ReactSelectMe extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      opened: props.isOpened === undefined ? false : props.isOpened,
      search: '',
    };

    this.ssr = typeof window === 'undefined';
  }

  /** **************************************
   ************ Lifecycle events ************
   **************************************** */
  componentDidMount() {
    document.addEventListener('click', this.closeGlobal);
  }

  static getDerivedStateFromProps({ isOpened }, state) {
    const { opened } = state;
    if (isOpened !== undefined && opened !== isOpened) {
      return {
        ...state,
        opened: isOpened,
      };
    }

    return state;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeGlobal);
  }

  /** **************************************
   **************** Utils *******************
   **************************************** */
  warn(msg) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(msg); // eslint-disable-line no-console
    }
  }

  closeGlobal = (e) => {
    const { isOpened, beforeClose } = this.props;
    const { opened } = this.state;
    // @maslianok: when you decide to change this, please, keep in mind, that this case should work:
    // Open A -> Open B -> A should be closed
    if (this.skipPropagation || !opened) {
      this.skipPropagation = undefined;
      return;
    }

    if (!isOpened && beforeClose(e) !== false) {
      this.setState({ opened: false }, this.onClose);
    }
  };

  skipEventPropagation = () => {
    this.skipPropagation = true;
  };

  validateDataStructure = (data) => {
    const { toImmutable } = this.props;
    return typeof toImmutable === 'function' ? toImmutable(data) : data;
  };

  patchSelectedOption = (selectedOption, options) => {
    const { valueKey, labelKey, forbidPhantomSelection } = this.props;

    // search for this option in the `options` array
    const value = typeof selectedOption === 'object' ? selectedOption[valueKey] : selectedOption;
    const option = options.find((o) => this.getProp(o, valueKey) === value);

    if (option || forbidPhantomSelection) {
      return option;
    }

    // if not found - make a phantom selection
    return typeof selectedOption === 'object'
      ? selectedOption
      : this.validateDataStructure({ [valueKey]: selectedOption, [labelKey]: selectedOption });
  };

  setSearchValue = (value) => {
    const { onSearch } = this.props;
    this.setState({
      search: value,
    });

    if (this.searchInput) {
      this.prevSearch = undefined;
      this.searchInput.innerHTML = value;
    }

    if (typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  /** **************************************
   ************** Renderers *****************
   **************************************** */
  renderList = () => {
    const { addNewItem, searchable, listRenderer, virtualized, s, renderVirtualizedList } = this.props;
    const { opened } = this.state;

    if (!opened) {
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

    const rowCount = this.getCount(options);
    if (rowCount && typeof renderVirtualizedList === 'function') {
      const rowClassName = cs('dd__optionVirtualized', s.dd__optionVirtualized);
      return renderVirtualizedList({
        rowRenderer: ({ style, index }) => this.renderOption(this.getProp(options, index), selectedOptions, style),
        rowCount,
        calculatedListHeight,
        getOptionHeight: this.getOptionHeight,
        listClasses,
        rowClassName,
      });
    }
    let listContent;
    if (rowCount) {
      listContent = options.map((option) => this.renderOption(option, selectedOptions));
    } else {
      listContent =
        addNewItem && searchable && this.getSearchString() ? this.renderAddNewItem() : this.renderNoItemsFound();
    }

    return (
      <div className={listClasses} style={{ maxHeight: `${calculatedListHeight}px` }}>
        {listContent}
      </div>
    );
  };

  renderOption = (option, selectedOptions, style) => {
    const { valueKey, labelKey, optionRenderer, s } = this.props;
    const isSelected = selectedOptions.some(
      (selected) => this.getProp(selected, valueKey) === this.getProp(option, valueKey),
    );
    const className = cs('dd__option', s.dd__option, {
      dd__selectedOption: isSelected,
      [s.dd__selectedOption]: isSelected,
    });

    const label =
      typeof optionRenderer === 'function' ? (
        optionRenderer(option, selectedOptions)
      ) : (
        <div className={className}>{this.getProp(option, labelKey)}</div>
      );

    return (
      <div key={this.getProp(option, valueKey)} style={style} onClick={this.onChange(option)}>
        {label}
      </div>
    );
  };

  renderSelectedBlock = () => {
    const { placeholder, searchable, multiple, s, selectedValueRenderer, selectedBlockRenderer } = this.props;
    const { opened } = this.state;
    const valueRenderer = selectedValueRenderer || this.renderSelectedItem;
    const selectedOptions = this.getSelectedOptions();

    if (selectedBlockRenderer) {
      return selectedBlockRenderer(selectedOptions, this.onChange, valueRenderer, this.renderSearchInput);
    }

    const selectedBlockClasses = cs('dd__selected', s.dd__selected);
    const placeholderClasses = cs('dd__placeholder', s.dd__placeholder);
    const noOptionsSelected = !this.getCount(selectedOptions);

    let selectedElements;
    if (!noOptionsSelected && (multiple || !searchable || !opened)) {
      selectedElements = selectedOptions.map((option) => valueRenderer(option, this.onChange));
    }

    return (
      <div className={selectedBlockClasses}>
        {selectedElements}
        {noOptionsSelected && (!searchable || !opened) && <div className={placeholderClasses}>{placeholder}</div>}
        {searchable && this.renderSearchInput()}
      </div>
    );
  };

  renderSearchInput = () => {
    const { s, searchInputRenderer } = this.props;
    const selectedOptions = this.getSelectedOptions();
    const className = cs('dd__search', s.dd__search);

    if (typeof searchInputRenderer === 'function') {
      return searchInputRenderer(selectedOptions, this.onSearch);
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
        onPaste={this.onSearch}
        onKeyUp={this.onSearch}
        ref={(e) => {
          this.searchInput = e;
        }}
      />
    );
  };

  renderSelectedItem = (option) => {
    const { valueKey, labelKey, multiple, s } = this.props;
    const selectedOptionClasses = cs('dd__selectedItem', s.dd__selectedItem);
    const crossIconClasses = cs('dd__crossIcon', s.dd__crossIcon);

    return (
      <div className={selectedOptionClasses} key={this.getProp(option, valueKey)}>
        <div>{this.getProp(option, labelKey)}</div>
        {multiple && (
          <div className={crossIconClasses} onClick={this.onRemoveSelected(option)}>
            ×
          </div>
        )}
      </div>
    );
  };

  renderIcon = () => {
    const { iconRenderer, s } = this.props;
    const { opened } = this.state;
    if (typeof iconRenderer === 'function') {
      return iconRenderer(opened);
    }

    const className = cs('dd__expandIcon', s.dd__expandIcon);
    const path =
      'M315,1318.04l-4.5,4.96-4.5-4.96,0.944-1.04,3.557,3.92,3.553-3.92,0.944,1.04m-9-5.08,4.5-4.96,4.5,4.96-0.944,1.04-3.557-3.92-3.553,3.92L306,1312.96'; // eslint-disable-line max-len
    return (
      <svg className={className} viewBox="0 0 9 15" width="9px" height="15px">
        <path d={path} transform="translate(-306 -1308)" />
      </svg>
    );
  };

  renderAddNewItem = () => {
    const { s, addNewItem } = this.props;
    const classNames = cs('dd__option', s.dd__option);

    if (addNewItem === false) {
      return null;
    }

    const search = this.getSearchString();
    if (typeof addNewItem === 'function') {
      return addNewItem(search, this.onAddNewItem);
    }

    return (
      <div className={classNames} onClick={this.onAddNewItem}>
        {typeof addNewItem === 'undefined' || addNewItem === true ? `Add '${search}'` : addNewItem}
      </div>
    );
  };

  renderNoItemsFound = () => {
    const { s, noItemsFound } = this.props;
    const classNames = cs('dd__option', 'dd__optionDisabled', s.dd__option, s.dd__optionDisabled);

    if (noItemsFound === false) {
      return null;
    }

    if (typeof noItemsFound === 'function') {
      return noItemsFound();
    }

    return (
      <div className={classNames}>
        {typeof noItemsFound === 'undefined' || noItemsFound === true ? 'No items found' : noItemsFound}
      </div>
    );
  };

  /** **************************************
   *************** Getters ******************
   **************************************** */
  getProp = (option, key) => {
    const { immutable } = this.props;
    return immutable ? option.get(key) : option[key];
  };

  getCount = (items) => {
    const { immutable } = this.props;
    if (!items) {
      return false;
    }
    return immutable ? items.size : items.length;
  };

  getOptions = () => {
    const { options, labelKey, valueKey } = this.props;
    if (this.getCount(options)) {
      // options are objects
      if (typeof this.getProp(options, 0) === 'object') {
        return options;
      }

      // options are strings or numbers
      return options.map((option) => this.validateDataStructure({ [labelKey]: option, [valueKey]: option }));
    }

    // no options
    return this.validateDataStructure([]);
  };

  getSelectedOptions = () => {
    const { value, multiple } = this.props;
    const options = this.getOptions();

    if (typeof value === 'undefined' || (multiple && !this.getCount(value))) {
      return this.validateDataStructure([]);
    }

    const patchedOptions = multiple
      ? value.map((v) => this.patchSelectedOption(v, options))
      : [this.patchSelectedOption(value, options)];

    return this.validateDataStructure(patchedOptions.filter((option) => !!option));
  };

  getListProps = () => {
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
      const optionsCount = this.getCount(options);
      if (optionsCount) {
        for (let i = 0; i < optionsCount; i += 1) {
          if (refinedHeight >= listMaxHeight) {
            refinedHeight = listMaxHeight;
            break;
          }
          refinedHeight += this.getOptionHeight({ index: i });
        }
      } else {
        refinedHeight = this.getOptionHeight({ index: -1 });
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
  };

  getOffset = () => {
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
  };

  getOptionHeight = ({ index }) => {
    const { optionHeight, options } = this.props;
    return typeof optionHeight === 'function' ? optionHeight(this.getProp(options, index)) : optionHeight;
  };

  getSearchString = () => (this.searchInput.textContent || this.searchInput.innerText || '').replace(/\n/g, '');

  /** **************************************
   **************** Events ******************
   **************************************** */
  onChange = (option, removeFromSelectedBlock) => () => {
    const { multiple, immutable, onChange, valueKey, labelKey, searchDefaultsToSelectedValue } = this.props;
    let selectedValue;

    if (multiple) {
      // prepare values for multiselect
      const values = this.getSelectedOptions();
      const selectedIndex = values.findIndex((v) => this.getProp(v, valueKey) === this.getProp(option, valueKey));
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

    if (onChange(selectedValue, removeFromSelectedBlock) === false) {
      this.skipEventPropagation();
    }

    if (searchDefaultsToSelectedValue) {
      this.setSearchValue(this.getProp(option, labelKey));
    }
  };

  onRemoveSelected = (option) => (e) => {
    this.skipEventPropagation();
    this.onChange(option, true)(e);
  };

  onToggle = (e) => {
    if (this.skipPropagation) {
      return;
    }

    const {
      props: { searchable, beforeOpen, beforeClose, isOpened, disabled },
      state: { opened },
    } = this;

    const nextState = isOpened !== undefined ? isOpened : !opened;
    const beforeFunc = nextState ? beforeOpen : beforeClose;

    if (!disabled && nextState !== opened && beforeFunc(e) !== false) {
      const afterFunc = nextState ? this.onOpen : this.onClose;
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
  };

  onSearch = (evt) => {
    // `document.documentMode` isn't undefined in IE only.
    // See more https://msdn.microsoft.com/library/cc196988(v=vs.85).aspx
    if (!this.searchInput || (evt.type === 'keyup' && !document.documentMode)) {
      return;
    }

    const doSearch = () => {
      const search = this.getSearchString();
      if (search !== this.prevSearch) {
        this.setState({ search });

        const { onSearch } = this.props;
        if (typeof onSearch === 'function') {
          onSearch(search);
        }
      }
      this.prevSearch = search;
    };

    if (!this.skipPropagation) {
      const { opened } = this.state;
      switch (evt.type) {
        case 'paste':
          // strip html tags
          evt.preventDefault();

          // Get pasted data via clipboard API
          const clipboardData = evt.clipboardData || window.clipboardData;
          const newContent = this.searchInput.textContent + clipboardData.getData('Text');

          // set new content
          this.searchInput.textContent = newContent;

          // place cursor to the end
          const range = document.createRange();
          range.selectNodeContents(this.searchInput);
          range.collapse(false);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          // trigger search
          doSearch();
          break;
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
          if (evt.nativeEvent.keyCode === 9 && opened) {
            // close dropdown on Tab keydown
            // blur via Tab
            this.onToggle(evt);
            this.skipPropagation = undefined;
          } else if (evt.nativeEvent.keyCode === 13) {
            // restrict new line
            evt.preventDefault();
          }
          break;
        case 'input':
        case 'keyup':
          doSearch();
          break;
        default:
          break;
      }
    }
  };

  onAddNewItem = (params) => {
    const { onAddNewItem } = this.props;
    if (typeof onAddNewItem === 'function') {
      onAddNewItem(this.getSearchString(), this.getSelectedOptions(), params);
    }
  };

  onOpen = () => {
    const { onOpen } = this.props;
    if (typeof onOpen === 'function') {
      onOpen();
    }
  };

  onClose = () => {
    const { onClose, searchClearOnClose, searchDefaultsToSelectedValue } = this.props;
    const { search } = this.state;

    if (!searchDefaultsToSelectedValue && searchClearOnClose && search) {
      this.setSearchValue('');
    }

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  /** **************************************
   **************** Render ******************
   **************************************** */
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
    const toggleHandler = this.onToggle;

    return (
      <div className={wrapperClassnames}>
        <div
          className={selectControlClasses}
          onClick={toggleHandler}
          ref={(el) => {
            this.el = el;
          }}
        >
          {this.renderSelectedBlock()}
          {this.renderIcon()}
        </div>
        {this.renderList()}
      </div>
    );
  }
}

ReactSelectMe.defaultProps = defaultProps;
ReactSelectMe.propTypes = propTypes;
