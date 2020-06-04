'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsDefinitions = require('./propsDefinitions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // @TODO
// hot keys: select option on Enter, remove on Backspcae, highlight etc
// disable option

var DEFAULT_LIST_POSITION = 'bottom';

var ReactSelectMe = function (_PureComponent) {
  _inherits(ReactSelectMe, _PureComponent);

  function ReactSelectMe(props) {
    _classCallCheck(this, ReactSelectMe);

    var _this = _possibleConstructorReturn(this, (ReactSelectMe.__proto__ || Object.getPrototypeOf(ReactSelectMe)).call(this, props));

    _this.closeGlobal = function (e) {
      var _this$props = _this.props,
          isOpened = _this$props.isOpened,
          beforeClose = _this$props.beforeClose;
      var opened = _this.state.opened;
      // @maslianok: when you decide to change this, please, keep in mind, that this case should work:
      // Open A -> Open B -> A should be closed

      if (_this.skipPropagation || !opened) {
        _this.skipPropagation = undefined;
        return;
      }

      if (!isOpened && beforeClose(e) !== false) {
        _this.setState({ opened: false }, _this.onClose);
      }
    };

    _this.skipEventPropagation = function () {
      _this.skipPropagation = true;
    };

    _this.validateDataStructure = function (data) {
      var toImmutable = _this.props.toImmutable;

      return typeof toImmutable === 'function' ? toImmutable(data) : data;
    };

    _this.patchSelectedOption = function (selectedOption, options) {
      var _this$validateDataStr;

      var _this$props2 = _this.props,
          valueKey = _this$props2.valueKey,
          labelKey = _this$props2.labelKey,
          forbidPhantomSelection = _this$props2.forbidPhantomSelection;

      // search for this option in the `options` array

      var value = (typeof selectedOption === 'undefined' ? 'undefined' : _typeof(selectedOption)) === 'object' ? selectedOption[valueKey] : selectedOption;
      var option = options.find(function (o) {
        return _this.getProp(o, valueKey) === value;
      });

      if (option || forbidPhantomSelection) {
        return option;
      }

      // if not found - make a phantom selection
      return (typeof selectedOption === 'undefined' ? 'undefined' : _typeof(selectedOption)) === 'object' ? selectedOption : _this.validateDataStructure((_this$validateDataStr = {}, _defineProperty(_this$validateDataStr, valueKey, selectedOption), _defineProperty(_this$validateDataStr, labelKey, selectedOption), _this$validateDataStr));
    };

    _this.setSearchValue = function (value) {
      var onSearch = _this.props.onSearch;

      _this.setState({
        search: value
      });

      if (_this.searchInput) {
        _this.prevSearch = undefined;
        _this.searchInput.innerHTML = value;
      }

      if (typeof onSearch === 'function') {
        onSearch(value);
      }
    };

    _this.renderList = function () {
      var _cs;

      var _this$props3 = _this.props,
          addNewItem = _this$props3.addNewItem,
          searchable = _this$props3.searchable,
          listRenderer = _this$props3.listRenderer,
          virtualized = _this$props3.virtualized,
          s = _this$props3.s,
          renderVirtualizedList = _this$props3.renderVirtualizedList;
      var opened = _this.state.opened;


      if (!opened) {
        return undefined;
      }

      var options = _this.getOptions();
      var selectedOptions = _this.getSelectedOptions();

      if (typeof listRenderer === 'function') {
        return listRenderer(options, selectedOptions, _this.renderOption, _this.onChange, _this.onToggle);
      }

      var _this$getListProps = _this.getListProps(),
          direction = _this$getListProps.direction,
          calculatedListHeight = _this$getListProps.calculatedListHeight;

      var listClasses = (0, _classnames2.default)('dd__list', s.dd__list, 'dd__openTo' + direction, s['dd__openTo' + direction], (_cs = {}, _defineProperty(_cs, s.dd__listVirtualized, virtualized), _defineProperty(_cs, 'dd__listVirtualized', virtualized), _cs));

      var rowCount = _this.getCount(options);
      if (rowCount && typeof renderVirtualizedList === 'function') {
        var rowClassName = (0, _classnames2.default)('dd__optionVirtualized', s.dd__optionVirtualized);
        return renderVirtualizedList({
          rowRenderer: function rowRenderer(_ref) {
            var style = _ref.style,
                index = _ref.index;
            return _this.renderOption(_this.getProp(options, index), selectedOptions, style);
          },
          rowCount: rowCount,
          calculatedListHeight: calculatedListHeight,
          getOptionHeight: _this.getOptionHeight,
          listClasses: listClasses,
          rowClassName: rowClassName
        });
      }
      var listContent = void 0;
      if (rowCount) {
        listContent = options.map(function (option) {
          return _this.renderOption(option, selectedOptions);
        });
      } else {
        listContent = addNewItem && searchable && _this.getSearchString() ? _this.renderAddNewItem() : _this.renderNoItemsFound();
      }

      return _react2.default.createElement(
        'div',
        { className: listClasses, style: { maxHeight: calculatedListHeight + 'px' } },
        listContent
      );
    };

    _this.renderOption = function (option, selectedOptions, style) {
      var _this$props4 = _this.props,
          valueKey = _this$props4.valueKey,
          labelKey = _this$props4.labelKey,
          optionRenderer = _this$props4.optionRenderer,
          s = _this$props4.s;

      var isSelected = selectedOptions.some(function (selected) {
        return _this.getProp(selected, valueKey) === _this.getProp(option, valueKey);
      });
      var className = (0, _classnames2.default)('dd__option', s.dd__option, _defineProperty({
        dd__selectedOption: isSelected
      }, s.dd__selectedOption, isSelected));

      var label = typeof optionRenderer === 'function' ? optionRenderer(option, selectedOptions) : _react2.default.createElement(
        'div',
        { className: className },
        _this.getProp(option, labelKey)
      );

      return _react2.default.createElement(
        'div',
        { key: _this.getProp(option, valueKey), style: style, onClick: _this.onChange(option) },
        label
      );
    };

    _this.renderSelectedBlock = function () {
      var _this$props5 = _this.props,
          placeholder = _this$props5.placeholder,
          searchable = _this$props5.searchable,
          multiple = _this$props5.multiple,
          s = _this$props5.s,
          selectedValueRenderer = _this$props5.selectedValueRenderer,
          selectedBlockRenderer = _this$props5.selectedBlockRenderer;
      var opened = _this.state.opened;

      var valueRenderer = selectedValueRenderer || _this.renderSelectedItem;
      var selectedOptions = _this.getSelectedOptions();

      if (selectedBlockRenderer) {
        return selectedBlockRenderer(selectedOptions, _this.onChange, valueRenderer, _this.renderSearchInput);
      }

      var selectedBlockClasses = (0, _classnames2.default)('dd__selected', s.dd__selected);
      var placeholderClasses = (0, _classnames2.default)('dd__placeholder', s.dd__placeholder);
      var noOptionsSelected = !_this.getCount(selectedOptions);

      var selectedElements = void 0;
      if (!noOptionsSelected && (multiple || !searchable || !opened)) {
        selectedElements = selectedOptions.map(function (option) {
          return valueRenderer(option, _this.onChange);
        });
      }

      return _react2.default.createElement(
        'div',
        { className: selectedBlockClasses },
        selectedElements,
        noOptionsSelected && (!searchable || !opened) && _react2.default.createElement(
          'div',
          { className: placeholderClasses },
          placeholder
        ),
        searchable && _this.renderSearchInput()
      );
    };

    _this.renderSearchInput = function () {
      var _this$props6 = _this.props,
          s = _this$props6.s,
          searchInputRenderer = _this$props6.searchInputRenderer;

      var selectedOptions = _this.getSelectedOptions();
      var className = (0, _classnames2.default)('dd__search', s.dd__search);

      if (typeof searchInputRenderer === 'function') {
        return searchInputRenderer(selectedOptions, _this.onSearch);
      }

      return _react2.default.createElement('div', {
        contentEditable: true,
        tabIndex: 0,
        className: className,
        onInput: _this.onSearch,
        onKeyDown: _this.onSearch,
        onFocus: _this.onSearch,
        onClick: _this.onSearch,
        onPaste: _this.onSearch,
        onKeyUp: _this.onSearch,
        ref: function ref(e) {
          _this.searchInput = e;
        }
      });
    };

    _this.renderSelectedItem = function (option) {
      var _this$props7 = _this.props,
          valueKey = _this$props7.valueKey,
          labelKey = _this$props7.labelKey,
          multiple = _this$props7.multiple,
          s = _this$props7.s;

      var selectedOptionClasses = (0, _classnames2.default)('dd__selectedItem', s.dd__selectedItem);
      var crossIconClasses = (0, _classnames2.default)('dd__crossIcon', s.dd__crossIcon);

      return _react2.default.createElement(
        'div',
        { className: selectedOptionClasses, key: _this.getProp(option, valueKey) },
        _react2.default.createElement(
          'div',
          null,
          _this.getProp(option, labelKey)
        ),
        multiple && _react2.default.createElement(
          'div',
          { className: crossIconClasses, onClick: _this.onRemoveSelected(option) },
          '\xD7'
        )
      );
    };

    _this.renderIcon = function () {
      var _this$props8 = _this.props,
          iconRenderer = _this$props8.iconRenderer,
          s = _this$props8.s;
      var opened = _this.state.opened;

      if (typeof iconRenderer === 'function') {
        return iconRenderer(opened);
      }

      var className = (0, _classnames2.default)('dd__expandIcon', s.dd__expandIcon);
      var path = 'M315,1318.04l-4.5,4.96-4.5-4.96,0.944-1.04,3.557,3.92,3.553-3.92,0.944,1.04m-9-5.08,4.5-4.96,4.5,4.96-0.944,1.04-3.557-3.92-3.553,3.92L306,1312.96'; // eslint-disable-line max-len
      return _react2.default.createElement(
        'svg',
        { className: className, viewBox: '0 0 9 15', width: '9px', height: '15px' },
        _react2.default.createElement('path', { d: path, transform: 'translate(-306 -1308)' })
      );
    };

    _this.renderAddNewItem = function () {
      var _this$props9 = _this.props,
          s = _this$props9.s,
          addNewItem = _this$props9.addNewItem;

      var classNames = (0, _classnames2.default)('dd__option', s.dd__option);

      if (addNewItem === false) {
        return null;
      }

      var search = _this.getSearchString();
      if (typeof addNewItem === 'function') {
        return addNewItem(search, _this.onAddNewItem);
      }

      return _react2.default.createElement(
        'div',
        { className: classNames, onClick: _this.onAddNewItem },
        typeof addNewItem === 'undefined' || addNewItem === true ? 'Add \'' + search + '\'' : addNewItem
      );
    };

    _this.renderNoItemsFound = function () {
      var _this$props10 = _this.props,
          s = _this$props10.s,
          noItemsFound = _this$props10.noItemsFound;

      var classNames = (0, _classnames2.default)('dd__option', 'dd__optionDisabled', s.dd__option, s.dd__optionDisabled);

      if (noItemsFound === false) {
        return null;
      }

      if (typeof noItemsFound === 'function') {
        return noItemsFound();
      }

      return _react2.default.createElement(
        'div',
        { className: classNames },
        typeof noItemsFound === 'undefined' || noItemsFound === true ? 'No items found' : noItemsFound
      );
    };

    _this.getProp = function (option, key) {
      var immutable = _this.props.immutable;

      return immutable ? option.get(key) : option[key];
    };

    _this.getCount = function (items) {
      var immutable = _this.props.immutable;

      if (!items) {
        return false;
      }
      return immutable ? items.size : items.length;
    };

    _this.getOptions = function () {
      var _this$props11 = _this.props,
          options = _this$props11.options,
          labelKey = _this$props11.labelKey,
          valueKey = _this$props11.valueKey;

      if (_this.getCount(options)) {
        // options are objects
        if (_typeof(_this.getProp(options, 0)) === 'object') {
          return options;
        }

        // options are strings or numbers
        return options.map(function (option) {
          var _this$validateDataStr2;

          return _this.validateDataStructure((_this$validateDataStr2 = {}, _defineProperty(_this$validateDataStr2, labelKey, option), _defineProperty(_this$validateDataStr2, valueKey, option), _this$validateDataStr2));
        });
      }

      // no options
      return _this.validateDataStructure([]);
    };

    _this.getSelectedOptions = function () {
      var _this$props12 = _this.props,
          value = _this$props12.value,
          multiple = _this$props12.multiple;

      var options = _this.getOptions();

      if (typeof value === 'undefined' || multiple && !_this.getCount(value)) {
        return _this.validateDataStructure([]);
      }

      var patchedOptions = multiple ? value.map(function (v) {
        return _this.patchSelectedOption(v, options);
      }) : [_this.patchSelectedOption(value, options)];

      return _this.validateDataStructure(patchedOptions.filter(function (option) {
        return !!option;
      }));
    };

    _this.getListProps = function () {
      var _this$props13 = _this.props,
          listHeight = _this$props13.listHeight,
          listMaxHeight = _this$props13.listMaxHeight,
          listPosition = _this$props13.listPosition,
          boundaryMargin = _this$props13.boundaryMargin,
          options = _this$props13.options;

      var direction = void 0;

      if (_this.ssr) {
        return {
          direction: DEFAULT_LIST_POSITION,
          calculatedListHeight: listHeight || listMaxHeight
        };
      }

      var refinedHeight = 0;
      if (listHeight) {
        refinedHeight = listHeight;
      } else {
        var optionsCount = _this.getCount(options);
        if (optionsCount) {
          for (var i = 0; i < optionsCount; i += 1) {
            if (refinedHeight >= listMaxHeight) {
              refinedHeight = listMaxHeight;
              break;
            }
            refinedHeight += _this.getOptionHeight({ index: i });
          }
        } else {
          refinedHeight = _this.getOptionHeight({ index: -1 });
        }
      }

      var _this$getOffset = _this.getOffset(),
          top = _this$getOffset.top,
          bottom = _this$getOffset.bottom;

      if (listPosition === 'auto') {
        direction = bottom < refinedHeight + boundaryMargin && top > bottom ? 'top' : 'bottom';
      } else {
        direction = listPosition;
      }

      var calculatedListHeight = void 0;
      if (listHeight) {
        calculatedListHeight = listHeight;
      } else {
        var maxAvailableHeight = (direction === 'top' ? top : bottom) - boundaryMargin;
        calculatedListHeight = Math.min(maxAvailableHeight, refinedHeight);
      }

      return {
        direction: direction,
        calculatedListHeight: calculatedListHeight
      };
    };

    _this.getOffset = function () {
      if (_this.ssr || !_this.el) {
        return { top: 0, bottom: 0 };
      }

      var getWrapper = _this.props.getWrapper;

      var wrapper = getWrapper();
      var rectEl = _this.el.getBoundingClientRect();
      if (wrapper) {
        // calculate offsets based on wrapper position
        var rectWrapper = wrapper.getBoundingClientRect();
        return {
          top: rectEl.top - rectWrapper.top,
          bottom: rectWrapper.bottom - rectEl.bottom
        };
      }

      // calculate offsets based on viewport
      var viewportHeight = window.document.documentElement.clientHeight;
      return { top: rectEl.top, bottom: viewportHeight - rectEl.bottom };
    };

    _this.getOptionHeight = function (_ref2) {
      var index = _ref2.index;
      var _this$props14 = _this.props,
          optionHeight = _this$props14.optionHeight,
          options = _this$props14.options;

      return typeof optionHeight === 'function' ? optionHeight(_this.getProp(options, index)) : optionHeight;
    };

    _this.getSearchString = function () {
      return (_this.searchInput.textContent || _this.searchInput.innerText || '').replace(/\n/g, '');
    };

    _this.onChange = function (option, removeFromSelectedBlock) {
      return function () {
        var _this$props15 = _this.props,
            multiple = _this$props15.multiple,
            immutable = _this$props15.immutable,
            onChange = _this$props15.onChange,
            valueKey = _this$props15.valueKey,
            labelKey = _this$props15.labelKey,
            searchDefaultsToSelectedValue = _this$props15.searchDefaultsToSelectedValue;

        var selectedValue = void 0;

        if (multiple) {
          // prepare values for multiselect
          var values = _this.getSelectedOptions();
          var selectedIndex = values.findIndex(function (v) {
            return _this.getProp(v, valueKey) === _this.getProp(option, valueKey);
          });
          if (selectedIndex === -1) {
            // add new option to selected values
            selectedValue = immutable ? values.push(option) : [].concat(_toConsumableArray(values), [option]);
          } else {
            // remove option from selected values
            selectedValue = values.filter(function (v, i) {
              return i !== selectedIndex;
            });
          }
        } else {
          selectedValue = option;
        }

        if (onChange(selectedValue, removeFromSelectedBlock) === false) {
          _this.skipEventPropagation();
        }

        if (searchDefaultsToSelectedValue) {
          _this.setSearchValue(_this.getProp(option, labelKey));
        }
      };
    };

    _this.onRemoveSelected = function (option) {
      return function (e) {
        _this.skipEventPropagation();
        _this.onChange(option, true)(e);
      };
    };

    _this.onToggle = function (e) {
      if (_this.skipPropagation) {
        return;
      }

      var _this$props16 = _this.props,
          searchable = _this$props16.searchable,
          beforeOpen = _this$props16.beforeOpen,
          beforeClose = _this$props16.beforeClose,
          isOpened = _this$props16.isOpened,
          disabled = _this$props16.disabled,
          opened = _this.state.opened;


      var nextState = isOpened !== undefined ? isOpened : !opened;
      var beforeFunc = nextState ? beforeOpen : beforeClose;

      if (!disabled && nextState !== opened && beforeFunc(e) !== false) {
        var afterFunc = nextState ? _this.onOpen : _this.onClose;
        _this.skipEventPropagation();
        if (searchable && _this.searchInput) {
          if (nextState) {
            _this.searchInput.focus();
          } else {
            _this.searchInput.blur();
            window.getSelection().removeAllRanges();
          }
        }
        _this.setState({ opened: nextState }, afterFunc);
      }
    };

    _this.onSearch = function (evt) {
      // `document.documentMode` isn't undefined in IE only.
      // See more https://msdn.microsoft.com/library/cc196988(v=vs.85).aspx
      if (!_this.searchInput || evt.type === 'keyup' && !document.documentMode) {
        return;
      }

      var doSearch = function doSearch() {
        var search = _this.getSearchString();
        if (search !== _this.prevSearch) {
          _this.setState({ search: search });

          var onSearch = _this.props.onSearch;

          if (typeof onSearch === 'function') {
            onSearch(search);
          }
        }
        _this.prevSearch = search;
      };

      if (!_this.skipPropagation) {
        var opened = _this.state.opened;

        switch (evt.type) {
          case 'paste':
            // strip html tags
            evt.preventDefault();

            // Get pasted data via clipboard API
            var clipboardData = evt.clipboardData || window.clipboardData;
            var newContent = _this.searchInput.textContent + clipboardData.getData('Text');

            // set new content
            _this.searchInput.textContent = newContent;

            // place cursor to the end
            var range = document.createRange();
            range.selectNodeContents(_this.searchInput);
            range.collapse(false);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // trigger search
            doSearch();
            break;
          case 'focus':
            // open dropdown onFocus
            if (!opened) {
              _this.onToggle(evt);
              _this.skipPropagation = undefined;
            }
            break;
          case 'click':
            // do not close dropdown onClick
            if (opened) {
              _this.skipEventPropagation();
            }
            break;
          case 'keydown':
            if (evt.nativeEvent.keyCode === 9 && opened) {
              // close dropdown on Tab keydown
              // blur via Tab
              _this.onToggle(evt);
              _this.skipPropagation = undefined;
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

    _this.onAddNewItem = function (params) {
      var onAddNewItem = _this.props.onAddNewItem;

      if (typeof onAddNewItem === 'function') {
        onAddNewItem(_this.getSearchString(), _this.getSelectedOptions(), params);
      }
    };

    _this.onOpen = function () {
      var onOpen = _this.props.onOpen;

      if (typeof onOpen === 'function') {
        onOpen();
      }
    };

    _this.onClose = function () {
      var _this$props17 = _this.props,
          onClose = _this$props17.onClose,
          searchClearOnClose = _this$props17.searchClearOnClose,
          searchDefaultsToSelectedValue = _this$props17.searchDefaultsToSelectedValue;
      var search = _this.state.search;


      if (!searchDefaultsToSelectedValue && searchClearOnClose && search) {
        _this.setSearchValue('');
      }

      if (typeof onClose === 'function') {
        onClose();
      }
    };

    _this.state = {
      opened: props.isOpened === undefined ? false : props.isOpened,
      search: ''
    };

    _this.ssr = typeof window === 'undefined';
    return _this;
  }

  /** **************************************
   ************ Lifecycle events ************
   **************************************** */


  _createClass(ReactSelectMe, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('click', this.closeGlobal);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.closeGlobal);
    }

    /** **************************************
     **************** Utils *******************
     **************************************** */

  }, {
    key: 'warn',
    value: function warn(msg) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(msg); // eslint-disable-line no-console
      }
    }

    /** **************************************
     ************** Renderers *****************
     **************************************** */


    /** **************************************
     *************** Getters ******************
     **************************************** */


    /** **************************************
     **************** Events ******************
     **************************************** */

  }, {
    key: 'render',


    /** **************************************
     **************** Render ******************
     **************************************** */
    value: function render() {
      var _cs3,
          _this2 = this;

      var _props = this.props,
          error = _props.error,
          multiple = _props.multiple,
          disabled = _props.disabled,
          s = _props.s;
      var opened = this.state.opened;

      // classnames

      var wrapperClassnames = (0, _classnames2.default)('dd__wrapper', s.dd__wrapper, (_cs3 = {
        dd__opened: opened,
        dd__error: error,
        dd__multi: multiple,
        dd__disabled: disabled
      }, _defineProperty(_cs3, s.dd__opened, opened), _defineProperty(_cs3, s.dd__error, error), _defineProperty(_cs3, s.dd__multi, multiple), _defineProperty(_cs3, s.dd__disabled, disabled), _cs3));
      var selectControlClasses = (0, _classnames2.default)('dd__selectControl', s.dd__selectControl);
      var toggleHandler = this.onToggle;

      return _react2.default.createElement(
        'div',
        { className: wrapperClassnames },
        _react2.default.createElement(
          'div',
          {
            className: selectControlClasses,
            onClick: toggleHandler,
            ref: function ref(el) {
              _this2.el = el;
            }
          },
          this.renderSelectedBlock(),
          this.renderIcon()
        ),
        this.renderList()
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(_ref3, state) {
      var isOpened = _ref3.isOpened;
      var opened = state.opened;

      if (isOpened !== undefined && opened !== isOpened) {
        return _extends({}, state, {
          opened: isOpened
        });
      }

      return state;
    }
  }]);

  return ReactSelectMe;
}(_react.PureComponent);

exports.default = ReactSelectMe;


ReactSelectMe.defaultProps = _propsDefinitions.defaultProps;
ReactSelectMe.propTypes = _propsDefinitions.propTypes;