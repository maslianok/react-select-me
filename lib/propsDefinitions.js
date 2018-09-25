'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypes = exports.defaultProps = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = exports.defaultProps = {
  addNewItem: false,
  beforeClose: function beforeClose() {
    return true;
  },
  beforeOpen: function beforeOpen() {
    return true;
  },
  boundaryMargin: 8,
  disabled: false,
  error: false,
  getWrapper: function getWrapper() {
    return null;
  },
  iconRenderer: undefined,
  immutable: false,
  isOpened: undefined,
  labelKey: 'label',
  listHeight: undefined,
  listRenderer: undefined,
  multiple: false,
  listMaxHeight: 400,
  listPosition: 'auto',
  noItemsFound: true,
  onAddNewItem: function onAddNewItem() {
    return null;
  },
  onChange: function onChange() {
    return null;
  },
  onClose: function onClose() {
    return null;
  },
  onOpen: function onOpen() {
    return null;
  },
  optionHeight: 40,
  options: [],
  optionRenderer: undefined,
  onSearch: undefined,
  placeholder: 'Select ...',
  valueKey: 'value',
  s: {},
  searchable: false,
  searchClearOnClose: true,
  searchDefaultsToSelectedValue: false,
  searchInputRenderer: undefined,
  selectedBlockRenderer: undefined,
  selectedValueRenderer: undefined,
  value: undefined,
  virtualized: false
};

var classType = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]);

var propTypes = exports.propTypes = {
  addNewItem: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string, _propTypes2.default.func, _propTypes2.default.element]),
  beforeClose: _propTypes2.default.func,
  beforeOpen: _propTypes2.default.func,
  boundaryMargin: _propTypes2.default.number,
  disabled: _propTypes2.default.bool,
  error: _propTypes2.default.bool,
  forbidPhantomSelection: _propTypes2.default.bool,
  getWrapper: _propTypes2.default.func,
  iconRenderer: _propTypes2.default.func,
  immutable: _propTypes2.default.bool,
  isOpened: _propTypes2.default.bool,
  labelKey: _propTypes2.default.string,
  listHeight: _propTypes2.default.number,
  listMaxHeight: _propTypes2.default.number,
  listPosition: _propTypes2.default.oneOf(['top', 'bottom', 'auto']),
  listRenderer: _propTypes2.default.func,
  multiple: _propTypes2.default.bool,
  noItemsFound: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string, _propTypes2.default.func, _propTypes2.default.element]),
  onAddNewItem: _propTypes2.default.func,
  onChange: _propTypes2.default.func.isRequired,
  onClose: _propTypes2.default.func,
  onOpen: _propTypes2.default.func,
  onSearch: _propTypes2.default.func,
  optionRenderer: _propTypes2.default.func,
  options: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
  placeholder: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
  optionHeight: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
  /* eslint-disable react/no-unused-prop-types */
  s: _propTypes2.default.shape({
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
    dd__selectedOption: classType
  }),
  /* eslint-enable react/no-unused-prop-types */
  searchable: _propTypes2.default.bool,
  searchClearOnClose: _propTypes2.default.bool,
  searchDefaultsToSelectedValue: _propTypes2.default.bool,
  searchInputRenderer: _propTypes2.default.func,
  selectedBlockRenderer: _propTypes2.default.func,
  selectedValueRenderer: _propTypes2.default.func,
  value: _propTypes2.default.any,
  valueKey: _propTypes2.default.string,
  virtualized: _propTypes2.default.bool,
  // from HOC
  toImmutable: _propTypes2.default.func
};