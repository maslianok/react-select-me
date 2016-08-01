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
