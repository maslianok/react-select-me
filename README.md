# react-select-me

## Advantages

#### 🐜 Lightweight

Only 4.28kb gzipped.

#### 🐙 Highly scalable and extendable

You can literally customize any piece of the component using [`listRenderer`](#listrenderer-function), [`optionRenderer`](#optionrenderer-function), [`selectedBlockRenderer`](#selectedblockrenderer-function), [`iconRenderer`](#iconrenderer-function) and [others](#properties).

#### 🦄 Immutable? Virtualized? No problem!

We have [various HOC's](#hoc) that may help you to integrate with your existing application.

#### 💃 CSS modules

All of our classes are extendable with CSS modules. Take a look at [list of them](#s-object).

#### 🕵️‍♂️ Debuggable

Yes, yes! You can inspect dropdown list with help of DevTools. You know what I'm talking about, right?

**Still not sure? We have a lot of other cool features. Take a look at our [examples](#examples).**

* [Installation](#installation)
* [Usage](#usage)
* [Examples](#examples)
  * [Live](#live)
  * [Local](#local)
* [HOC](#hoc)
* [Properties:](#properties)
  * [options: Array](#options-array)
  * [value: Any](#value-any)
  * [multiple: Bool](#multiple-bool)
  * [searchable: Bool](#searchable-bool)
  * [virtualized: Bool](#virtualized-bool)
  * [onChange: Function](#onchange-function)
  * [onSearch: Function](#onsearch-function)
  * [onAddNewItem: Bool](#onaddnewitem-bool)
  * [selectedValueRenderer: Function](#selectedvaluerenderer-function)
  * [selectedBlockRenderer: Function](#selectedblockrenderer-function)
  * [optionRenderer: Function](#optionrenderer-function)
  * [listRenderer: Function](#listrenderer-function)
  * [iconRenderer: Function](#iconrenderer-function)
  * [noItemsFound: Bool | String | Function](#noitemsfound-bool--string--function)
  * [addNewItem: Bool | String | Function](#addnewitem-bool--string--function)
  * [isOpened: Bool](#isopened-bool)
  * [beforeOpen: Function](#beforeopen-function)
  * [beforeClose: Function](#beforeclose-function)
  * [onOpen: Function](#onopen-function)
  * [onClose: Function](#onclose-function)
  * [searchClearOnClose: Bool](#searchclearonclose-bool)
  * [listMaxHeight: Number](#listmaxheight-number)
  * [listHeight: Number](#listheight-number)
  * [optionHeight: Number | Function](#optionheight-number--function)
  * [listPosition: String](#listposition-string)
  * [getWrapper: Function](#getwrapper-function)
  * [boundaryMargin: Number](#boundarymargin-number)
  * [forbidPhantomSelection: Bool](#forbidphantomselection-bool)
  * [s: Object](#s-object)

## Installation

`npm i react-select-me --save`

## Usage

```javascript
import Select from 'react-select-me';

// IMPORTANT If you want to provide default styles you have to import them
import 'react-select-me/lib/ReactSelectMe.css';

const options = [{ value: 1, label: 'Label 1' }, { value: 2, label: 'Label 2' }];

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
    return <Select options={options} value={this.state.value} onChange={this.onChange} />;
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

## HOC

We've extracted some key features into separate HOCs to keep the main library as small as possible

### makeVirtualized

Uses [virtualized list](https://bvaughn.github.io/react-virtualized/#/components/List) to render dropdown options. It allows you to render huge lists without affecting the page performance.

```javascript
import Select from 'react-select-me';
import makeVirtualized from 'react-select-me/lib/hoc/makeVirtualized';

const VirtualizedSelect = makeVirtualized(Select);

// now you can use the VirtualizedSelect component as usual
// ...
<VirtualizedSelect options={options} value={this.state.value} onChange={this.onChange} />;
// ...
```

### makeImmutable

Integrates with [immutable-js](https://facebook.github.io/immutable-js/) which allows you to pass immutable structures as component's props.

```javascript
import Select from 'react-select-me';
import makeImmutable from 'react-select-me/lib/hoc/makeImmutable';

const ImmutableSelect = makeImmutable(Select);

// now you can pass immutable data as options
// ...
<ImmutableSelect options={options} value={this.state.value} onChange={this.onChange} />;
// ...
```

## Properties:

### options: Array

_Description: list of dropdown options_

Default: `undefined`

Examples:

* List of primitives: `[1, 2]`
* List of objects: `[{value: 1, label: 'Label 1'}, {value: 2, label: 'Label 2'}]`

### value: Any

_Description: selected value / values_

Default: `undefined`

Examples:

* Primitive: `1`
* Object: `{value: 1, label: 'Label 1'}`
* Array of primitives for multiselect: `[1, 2]`
* Array of objects for multiselect: `[{value: 1, label: 'Label 1'}, {value: 2, label: 'Label 2'}]`

### multiple: Bool

_Description: multi-value dropdown_

Default: `false`

### searchable: Bool

_Description: ability to search / filter options. [`onSearch`](#onSearch-function) function will be called_

Default: `false`

### virtualized: Bool

_Description: partly render list options using [react-virtualized](https://bvaughn.github.io/react-virtualized/). Huge time to render boost on large datasets. You have to set [`optionHeight`](#optionheight-number--function) property if your option height differs from default._

Default: `false`

### immutable: Bool

_Description: parse data as [immutable](https://facebook.github.io/immutable-js/) lists. When this property set to `true` you have to provide [`options`](#options-array) and [`value`](#value-any) as immutable objects._

Default: `false`

### onChange: Function

_Description: onChange callback. Return `false` to leave dropdown opened._

Default: `undefined`

Arguments:

* `value: Array|Object|String|Number`: selected option (or array of options for multi select)

Example:

```javascript
onChange(value) {
  // handle new value
}
```

### onSearch: Function

_Description: onSearch callback. Calls on every search input change. You have to process search string inside this function and filter your options based on your needs._

Default: `undefined`

Arguments:

* `search: String`: search string

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

_Description: callback to handle click on the 'Add new item' option_

Default: `undefined`

Arguments:

* `search: String`: search string

### selectedValueRenderer: Function

_Description: function to render selected value_

Default: `undefined`

Arguments:

* `option: Object|String|Number`: option to render
* `onRemove: Function`: default function to remove value

Example:

```javascript
selectedValueRenderer(option, onRemove) {
  return <div style={{color: 'red'}}>{option.label}</div>;
}
```

### selectedBlockRenderer: Function

_Description: function to render block with selected options_

Default: `undefined`

Arguments:

* `selectedOptions: Array`: currently selected options
* `onRemove: Function`: default function to remove value
* `selectedValueRenderer: Function`: default function to render selected value
* `searchInputRenderer: Function`: default function to render search block

Example:

```javascript
selectedBlockRenderer(selectedOptions, onRemove) {
  return <div>{selectedOptions.map(option => option.label).join(', ')}</div>;
}
```

### optionRenderer: Function

_Description: function to render custom options_

Default: `undefined`

Arguments:

* `option: Object|String|Number`: option to render
* `selectedOptions: Array`: currently selected options

Example:

```javascript
optionRenderer(option, selectedOptions) {
  return <div style={{color: 'red'}}>{option.label}</div>;
}
```

### listRenderer: Function

_Description: function to render the list_

Arguments:

* `options: Array`: list of options
* `selectedOptions: Array`: currently selected options
* `optionRenderer: Function`: default option renderer
* `onChange: Function`: default onChange callback
* `onToggleList: Function`: toggle list visibility

Example:

* Simple

```javascript
listRenderer(options, selectedOptions, optionRenderer) {
  return <ul>{options.map(option => optionRenderer(option, selectedOptions))}</ul>;
}
```

* Advanced

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

_Description: function to render custom icon._

Default: `undefined`

Arguments:

* `isOpened: Bool`: whether the list opened

Example:

```javascript
iconRenderer(isOpened) {
  return <i className={isOpened ? 'icon-open' : 'icon-close'} />;
}
```

### noItemsFound: Bool | String | Function

_Description: Bool: whether to display 'No items found' option or not. String: 'No items found' label. Function: 'No items found' renderer_

Default: `true`

Example:

```javascript
noItemsFound() {
  return <div className="my-awesome-class">No items found</div>;
}
```

### addNewItem: Bool | String | Function

_Description: Bool: whether to display 'Add new item' option or not. String: 'Add new item' label. Function: 'Add new item' renderer. You must handle onClick event via `onAddNewItem` callback or your own callback in case of custom renderer. Note: for the 'Add new item' option to display, `searchable` must be true and `options` must be empty._

Default: `false`

Example:

```javascript
addNewItem(search) {
  return <div className="my-awesome-class" onClick={this.addNewItemToDropdownOptions}>{`Add '${search}'`}</div>;
}
```

### isOpened: Bool

_Description: setting this property makes open / close functionality uncontrollable. It always opened when `isOpened === true` and always closed when `isOpened === false`. Setting this property to `undefined` returns component to the usual behaviour._

Default: `undefined`

### beforeOpen: Function

_Description: before open handler. Return `false` to leave dropdown closed._

Default: `undefined`

Arguments:

* `event: Object`: event

### beforeClose: Function

_Description: before close event. Return `false` to leave dropdown opened._

Default: `undefined`

### onOpen: Function

_Description: handler for when the menu opens_

Default: `undefined`

### onClose: Function

_Description: handler for when the menu closes_

Default: `undefined`

### searchClearOnClose: Bool

_Description: whether to clear the input on close or not_

Default: `true`

### listMaxHeight: Number

_Description: Dropdown list max height in pixels._

Default: `400`

### listHeight: Number

_Description: when you set this property the list will always have the constant height despite options length and available space. You have to set this property only when you are creating something like horizontally scrolling lists or some other weird lists :) Otherwise, you probably need to `listMaxHeight`._

### optionHeight: Number | Function

_Description: option height. This property has to be set for virtualized lists, because [react-virtualized](https://github.com/bvaughn/react-virtualized/blob/master/docs/VirtualScroll.md#prop-types) has to know total options height to correctly display scroll. It also used to calculate direction to open the list (in case of `direction="auto"`)._

Default: `40`

### listPosition: String

_Description: Dropdown list position._

Default: `auto`

Available values:

* `top`: expand to top
* `bottom`: expand to bottom
* `auto`: auto detection based on `wrapper` element

### getWrapper: Function

_Description: Function to get wrapper element. Commonly you have to set this parameter if any of component's parents has `overflow: hidden` property. This parameter affects to `listMaxHeight` and `listPosition` properties._

### boundaryMargin: Number

_Description: the minimal distance between screen / `wrapper` boundaries and dropdown list._

Default: `6`

### forbidPhantomSelection: Bool

_Description: doesn't select a `value` option if it doesn't exist in `options` array_

Default: `false`

### s: Object

_Description: component classNames._

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

* If you are using css modules you can import default styles directly to the component:

```javascript
import Select from 'react-select-me';
import s from 'react-select-me/src/ReactSelectMe.css';
...
<Select s={s} {...otherProps} />
```

* If you want to customize any element with help of your own classes

```javascript
const classNames = {
  // usual class names
  dd__wrapper: 'my-super-class',
  // or even with css modules
  dd__selectedOption: s.mySuperSelectedOption,
};
<Select s={classNames} {...otherProps} />;
```
