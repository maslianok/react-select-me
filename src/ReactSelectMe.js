// @TODO
// hot keys: select option on Enter, remove on Backspcae, highlight etc
// disable option

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
      search: '',
    };

    this.ssr = typeof window === 'undefined';

    this.closeGlobal = this.closeGlobal.bind(this);
    this.skipEventPropagation = this.skipEventPropagation.bind(this);
    this.toImmutable = this.toImmutable.bind(this);
    this.patchSelectedOption = this.patchSelectedOption.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.getOptionHeight = this.getOptionHeight.bind(this);
    this.getSelectedOptions = this.getSelectedOptions.bind(this);
    this.getListProps = this.getListProps.bind(this);
    this.getOffset = this.getOffset.bind(this);
    this.getCount = this.getCount.bind(this);
    this.getSearchString = this.getSearchString.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.renderSelectedBlock = this.renderSelectedBlock.bind(this);
    this.renderSearchInput = this.renderSearchInput.bind(this);
    this.renderSelectedItem = this.renderSelectedItem.bind(this);
    this.renderAddNewItem = this.renderAddNewItem.bind(this);
    this.renderNoItemsFound = this.renderNoItemsFound.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRemoveSelected = this.onRemoveSelected.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onAddNewItem = this.onAddNewItem.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
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
    const { isOpened, beforeClose } = this.props;
    // @maslianok: when you decide to change this, please, keep in mind, that this case should work:
    // Open A -> Open B -> A should be closed
    if (this.skipPropagation || !this.state.opened) {
      this.skipPropagation = undefined;
      return;
    }

    if (!isOpened && beforeClose(e) !== false) {
      this.setState({ opened: false }, this.onClose);
    }
  }

  skipEventPropagation() {
    this.skipPropagation = true;
  }

  toImmutable(data) {
    const { immutable } = this.props;
    return immutable ? fromJS(data) : data;
  }

  patchSelectedOption(selectedOption, options) {
    const { valueKey, labelKey } = this.props;
    // if object
    if (typeof selectedOption === 'object') {
      // just return this value
      return selectedOption;
    }

    // if primitive (Number or String)

    // search for this option in `options` array
    const option = options.find(o => this.getProp(o, valueKey) === selectedOption);
    if (option) {
      return option;
    }

    // if not found - map it to object
    return this.toImmutable({ [valueKey]: selectedOption, [labelKey]: selectedOption });
  }
  /* ***************************************
  ************** Renderers *****************
  *****************************************/
  renderList() {
    const { addNewItem, searchable, listRenderer, virtualized, s } = this.props;

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

    const rowCount = this.getCount(options);
    if (rowCount && virtualized) {
      const rowClassName = cs('dd__optionVirtualized', s.dd__optionVirtualized);
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

    let listContent;
    if (rowCount) {
      listContent = options.map(option => this.renderOption(option, selectedOptions));
    } else {
      listContent = addNewItem && searchable && this.getSearchString() ?
        this.renderAddNewItem() :
        this.renderNoItemsFound();
    }

    return (
      <div className={listClasses} style={{ maxHeight: `${calculatedListHeight}px` }}>
        {listContent}
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
    const noOptionsSelected = !this.getCount(selectedOptions);

    let selectedElements;
    if (!noOptionsSelected && (multiple || !searchable || !opened)) {
      selectedElements = selectedOptions.map(option => valueRenderer(option, this.onChange));
    }

    return (
      <div className={selectedBlockClasses}>
        {selectedElements}
        {noOptionsSelected && (!searchable || !opened) && <div className={placeholderClasses}>{placeholder}</div>}
        {searchable && this.renderSearchInput()}
      </div>
    );
  }

  renderSearchInput() {
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
        ref={e => (this.searchInput = e)}
      />
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

  renderAddNewItem() {
    const { s, addNewItem } = this.props;
    const classNames = cs('dd__option', s.dd__option);

    if (addNewItem === false) {
      return null;
    }

    const search = this.getSearchString();
    if (typeof addNewItem === 'function') {
      return addNewItem(search);
    }

    return (
      <div className={classNames} onClick={this.onAddNewItem}>
        {typeof addNewItem === 'undefined' ? `Add '${search}'` : addNewItem}
      </div>
    );
  }

  renderNoItemsFound() {
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
        {typeof noItemsFound === 'undefined' ? 'No items found' : noItemsFound}
      </div>
    );
  }
  /* ***************************************
  *************** Getters ******************
  *****************************************/
  getProp(option, key) {
    const { immutable } = this.props;
    return immutable ? option.get(key) : option[key];
  }

  getCount(items) {
    const { immutable } = this.props;
    if (!items) {
      return false;
    }
    return immutable ? items.size : items.length;
  }

  getOptions() {
    const { options, labelKey, valueKey } = this.props;
    if (this.getCount(options)) {
      // options are objects
      if (typeof this.getProp(options, 0) === 'object') {
        return options;
      }

      // options are strings or numbers
      return options.map(option => this.toImmutable({ [labelKey]: option, [valueKey]: option }));
    }

    // no options
    return this.toImmutable([]);
  }

  getSelectedOptions() {
    const { value, multiple } = this.props;
    const options = this.getOptions();

    if (!value || (multiple && !this.getCount(value))) {
      return this.toImmutable([]);
    }

    return multiple ?
      value.map(v => this.patchSelectedOption(v, options)) :
      this.toImmutable([this.patchSelectedOption(value, options)]);
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
      const optionsCount = this.getCount(options);
      if (optionsCount) {
        for (let i = 0; i < optionsCount; i++) {
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

  getSearchString() {
    return (this.searchInput.textContent || this.searchInput.innerText || '').replace(/\n/g, '');
  }
  /* ***************************************
  **************** Events ******************
  *****************************************/
  onChange(option, removeFromSelectedBlock) {
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

      if (onChange(selectedValue, removeFromSelectedBlock) === false) {
        this.skipEventPropagation();
      }
    };
  }

  onRemoveSelected(option) {
    return e => {
      this.skipEventPropagation();
      this.onChange(option, true)(e);
    };
  }

  onToggle(e) {
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
          const search = this.getSearchString();
          if (search !== this.prevSearch) {
            this.setState({ search });

            const { onSearch } = this.props;
            if (typeof onSearch === 'function') {
              onSearch(search);
            }
          }
          this.prevSearch = search;
          break;
        default:
          break;
      }
    }
  }

  onAddNewItem() {
    const { onAddNewItem } = this.props;
    if (typeof onAddNewItem === 'function') {
      onAddNewItem(this.getSearchString());
    }
  }

  onOpen() {
    const { onOpen } = this.props;
    if (typeof onOpen === 'function') {
      onOpen();
    }
  }

  onClose() {
    const { onClose, clearFilterOnClose, onSearch } = this.props;
    const { search } = this.state;

    if (clearFilterOnClose && search) {
      this.setState({
        search: '',
      });

      if (this.searchInput) {
        this.prevSearch = undefined;
        this.searchInput.innerHTML = '';
      }

      if (typeof onSearch === 'function') {
        onSearch('');
      }
    }

    if (typeof onClose === 'function') {
      onClose();
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
    const toggleHandler = this.onToggle;

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
  addNewItem: false,
  beforeClose: () => true,
  beforeOpen: () => true,
  boundaryMargin: 8,
  clearFilterOnClose: true,
  getWrapper: () => null,
  onAddNewItem: () => null,
  onClose: () => null,
  onChange: () => null,
  onOpen: () => null,
  optionHeight: 40,
  options: [],
  labelKey: 'label',
  listMaxHeight: 400,
  listPosition: 'auto',
  noItemsFound: true,
  placeholder: 'Select ...',
  valueKey: 'value',
  s: {},
};

const classType = T.oneOfType([T.string, T.array]);
ReactSelectMe.propTypes = {
  addNewItem: T.oneOfType([T.bool, T.string, T.func, T.element]),
  beforeClose: T.func,
  beforeOpen: T.func,
  boundaryMargin: T.number,
  clearFilterOnClose: T.bool,
  disabled: T.bool,
  error: T.bool,
  getWrapper: T.func,
  iconRenderer: T.func,
  immutable: T.bool,
  isOpened: T.bool,
  labelKey: T.string,
  listHeight: T.number,
  listMaxHeight: T.number,
  listPosition: T.oneOf(['top', 'bottom', 'auto']),
  listRenderer: T.func,
  multiple: T.bool,
  noItemsFound: T.oneOfType([T.bool, T.string, T.func, T.element]),
  onAddNewItem: T.func,
  onChange: T.func.isRequired,
  onClose: T.func,
  onOpen: T.func,
  onSearch: T.func,
  optionRenderer: T.func,
  options: T.oneOfType([T.array, T.object]),
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
    // dropdown option
    dd__optionDisabled: classType,
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
