# react-select-me

## Advantages:
- **Highly scalable and extendable**

You can customize any appearance or/and behaviour you want. We have a lot of useful renderers: [`listRenderer`](#listrenderer-function), [`optionRenderer`](#optionrenderer-function), [`selectedBlockRenderer`](#selectedblockrenderer-function), [`iconRenderer`](#iconrenderer-function) etc.

- **Immutable data structure support**

Now you don't have to call `.toJS()` every time you render the element. Just pass the data as is and little unicorns do the rest of work for you!

- **Mutable data structure support**

Just kidding :) Of course, you still can pass usual arrays as options.

- **Virtualization out of the box**

Want to render 5k options. No problem, just add [`virtualized`](#virtualized-bool) property.

- **CSS modules**

All of our classes are extendable with CSS modules. Take a look at [list of them](#s-object).

- **Direction to open**

We automatically detect direction to open. You can even tell us to calculate offsets based on any [wrapper](#getwrapper-function) you want. You can disable this functionality by changing [`direction`](#direction-string) property.

- **Server side rendering**

It wasn't hard at all.

- **Debuggable**

Yes, yes! You can inspect dropdown list with help of DevTools. You know what I'm talking about, right?

**Still not sure? We have a lot of other cool features. Take a look at our [examples](#examples).**

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
  - [Live](#live)
  - [Local](#local)
- [Properties:](#properties)
  - [options: Array](#options-array)
  - [value: Any](#value-any)
  - [multiple: Bool](#multiple-bool)
  - [searchable: Bool](#searchable-bool)
  - [virtualized: Bool](#virtualized-bool)
  - [immutable: Bool](#immutable-bool)
  - [onChange: Function](#onchange-function)
  - [onSearch: Function](#onsearch-function)
  - [onAddNewItem: Bool](#onaddnewitem-bool)
  - [selectedValueRenderer: Function](#selectedvaluerenderer-function)
  - [selectedBlockRenderer: Function](#selectedblockrenderer-function)
  - [optionRenderer: Function](#optionrenderer-function)
  - [listRenderer: Function](#listrenderer-function)
  - [iconRenderer: Function](#iconrenderer-function)
  - [noItemsFound: Bool | String | Function](#noitemsfound-bool--string--function)
  - [addNewItem: Bool | String | Function](#addnewitem-bool--string--function)
  - [isOpened: Bool](#isopened-bool)
  - [beforeOpen: Function](#beforeopen-function)
  - [beforeClose: Function](#beforeclose-function)
  - [onOpen: Function](#onopen-function)
  - [onClose: Function](#onclose-function)
  - [searchClearOnClose: Bool](#searchclearonclose-bool)
  - [listMaxHeight: Number](#listmaxheight-number)
  - [listHeight: Number](#listheight-number)
  - [optionHeight: Number | Function](#optionheight-number--function)
  - [listPosition: String](#listposition-string)
  - [getWrapper: Function](#getwrapper-function)
  - [boundaryMargin: Number](#boundarymargin-number)
  - [s: Object](#s-object)

## Installation
`npm i react-select-me --save`

## Usage
```javascript
import Select from 'react-select-me';

// IMPORTANT If you want to provide default styles you have to import them
import 'react-select-me/lib/ReactSelectMe.css';

const options = [
  { value: 1, label: 'Label 1' },
  { value: 2, label: 'Label 2' },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: null };
    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    this.setState({ value });
  }
  render() {
    return (
      <Select options={options} value={this.state.value} onChange={this.onChange} />
    );
  }
}
```

## Examples
### Live
http://maslianok.github.io/react-select-me/

### Local
1. Clone the repo
`git clone git@github.com:maslianok/react-select-me.git`

2. Go to the directory
`cd react-select-me`

3. Install dependencies
`npm i`

4. Run demo app
`npm start`

5. Open `localhost:3000` in your browser


## Properties:
### options: Array
*Description: list of dropdown options*

Default: `undefined`

Examples:
- List of primitives: `[1, 2]`
- List of objects: `[{value: 1, label: 'Label 1'}, {value: 2, label: 'Label 2'}]`

### value: Any
*Description: selected value / values*

Default: `undefined`

Examples:
- Primitive: `1`
- Object: `{value: 1, label: 'Label 1'}`
- Array of primitives for multiselect: `[1, 2]`
- Array of objects for multiselect: `[{value: 1, label: 'Label 1'}, {value: 2, label: 'Label 2'}]`

### multiple: Bool
*Description: multi-value dropdown*

Default: `false`

### searchable: Bool
*Description: ability to search / filter options. [`onSearch`](#onSearch-function) function will be called*

Default: `false`

### virtualized: Bool
*Description: partly render list options using [react-virtualized](https://bvaughn.github.io/react-virtualized/). Huge time to render boost on large datasets. You have to set [`optionHeight`](#optionheight-number--function) property if your option height differs from default.*

Default: `false`

### immutable: Bool
*Description: parse data as [immutable](https://facebook.github.io/immutable-js/) lists. When this property set to `true` you have to provide [`options`](#options-array) and [`value`](#value-any) as immutable objects.*

Default: `false`

### onChange: Function
*Description: onChange callback. Return `false` to leave dropdown opened.*

Default: `undefined`

Arguments:
- `value: Array|Object|String|Number`: selected option (or array of options for multi select)

Example:
```javascript
onChange(value) {
  // handle new value
}
```

### onSearch: Function
*Description: onSearch callback. Calls on every search input change. You have to process search string inside this function and filter your options based on your needs.*

Default: `undefined`

Arguments:
- `search: String`: search string

Example:
```javascript
const options = [
  { value: 1, label: 'Label 1' },
  { value: 2, label: 'Label 2' },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options };
    this.onSearch = this.onSearch.bind(this);
  }
  onSearch(searchString) {
    this.setState({
      options: options.filter(o => o.label.indexOf(searchString) > -1)
    });
  }
  render() {
    return (
      <Select
        searchable
        options={this.state.options}
        onSearch={this.onSearch}
        ...
      />
    );
  }
}
```

### onAddNewItem: Bool
*Description: callback to handle click on the 'Add new item' option*

Default: `undefined`

Arguments:
- `search: String`: search string

### selectedValueRenderer: Function
*Description: function to render selected value*

Default: `undefined`

Arguments:
- `option: Object|String|Number`: option to render
- `onRemove: Function`: default function to remove value

Example:
```javascript
selectedValueRenderer(option, onRemove) {
  return <div style={{color: 'red'}}>{option.label}</div>;
}
```

### selectedBlockRenderer: Function
*Description: function to render block with selected options*

Default: `undefined`

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

### optionRenderer: Function
*Description: function to render custom options*

Default: `undefined`

Arguments:
- `option: Object|String|Number`: option to render
- `selectedOptions: Array`: currently selected options

Example:
```javascript
optionRenderer(option, selectedOptions) {
  return <div style={{color: 'red'}}>{option.label}</div>;
}
```

### listRenderer: Function
*Description: function to render the list*

Arguments:
- `options: Array`: list of options
- `selectedOptions: Array`: currently selected options
- `optionRenderer: Function`: default option renderer
- `onChange: Function`: default onChange callback
- `onToggleList: Function`: toggle list visibility

Example:
- Simple
```javascript
listRenderer(options, selectedOptions, optionRenderer) {
  return <ul>{options.map(option => optionRenderer(option, selectedOptions))}</ul>;
}
```
- Advanced
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

### iconRenderer: Function
*Description: function to render custom icon.*

Default: `undefined`

Arguments:
- `isOpened: Bool`: whether the list opened

Example:
```javascript
iconRenderer(isOpened) {
  return <i className={isOpened ? 'icon-open' : 'icon-close'} />;
}
```

### noItemsFound: Bool | String | Function
*Description: Bool: whether to display 'No items found' option or not. String: 'No items found' label. Function: 'No items found' renderer*

Default: `true`

Example:
```javascript
noItemsFound() {
  return <div className="my-awesome-class">No items found</div>;
}
```

### addNewItem: Bool | String | Function
*Description: Bool: whether to display 'Add new item' option or not. String: 'Add new item' label. Function: 'Add new item' renderer. You must handle onClick event via `onAddNewItem` callback or your own callback in case of custom renderer.*

Default: `false`

Example:
```javascript
addNewItem(search) {
  return <div className="my-awesome-class" onClick={this.addNewItemToDropdownOptions}>{`Add '${search}'`}</div>;
}
```

### isOpened: Bool
*Description: setting this property makes open / close functionality uncontrollable. It always opened when `isOpened === true` and always closed when `isOpened === false`. Setting this property to `undefined` returns component to the usual behaviour.*

Default: `undefined`

### beforeOpen: Function
*Description: before open handler. Return `false` to leave dropdown closed.*

Default: `undefined`

Arguments:
- `event: Object`: event

### beforeClose: Function
*Description: before close event. Return `false` to leave dropdown opened.*

Default: `undefined`

### onOpen: Function
*Description: handler for when the menu opens*

Default: `undefined`

### onClose: Function
*Description: handler for when the menu closes*

Default: `undefined`

### searchClearOnClose: Bool
*Description: whether to clear the input on close or not*

Default: `true`

### listMaxHeight: Number
*Description: Dropdown list max height in pixels.*

Default: `400`

### listHeight: Number
*Description: when you set this property the list will always have the constant height despite options length and available space. You have to set this property only when you are creating something like horizontally scrolling lists or some other weird lists :) Otherwise, you probably need to `listMaxHeight`.*

### optionHeight: Number | Function
*Description: option height. This property has to be set for virtualized lists, because [react-virtualized](https://github.com/bvaughn/react-virtualized/blob/master/docs/VirtualScroll.md#prop-types) has to know total options height to correctly display scroll. It also used to calculate direction to open the list (in case of `direction="auto"`).*

Default: `40`

### listPosition: String
*Description: Dropdown list position.*

Default: `auto`

Available values:
- `top`: expand to top
- `bottom`: expand to bottom
- `auto`: auto detection based on `wrapper` element

### getWrapper: Function
*Description: Function to get wrapper element. Commonly you have to set this parameter if any of component's parents has `overflow: hidden` property. This parameter affects to `listMaxHeight` and `listPosition` properties.*

### boundaryMargin: Number
*Description: the minimal distance between screen / `wrapper` boundaries and dropdown list.*

Default: `6`

### s: Object
*Description: component classNames.*

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
- If you are using css modules you can import default styles directly to the component:
```javascript
import Select from 'react-select-me';
import s from 'react-select-me/src/ReactSelectMe.css';
...
<Select s={s} {...otherProps} />
```

- If you want to customize any element with help of your own classes
```javascript
const classNames = {
  // usual class names
  dd__wrapper: 'my-super-class',
  // or even with css modules
  dd__selectedOption: s.mySuperSelectedOption,
};
<Select s={classNames} {...otherProps} />
```
