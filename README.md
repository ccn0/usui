# UserScript UI

[**U**ser**S**cript **UI**](https://usui.qog.app/), USUI, is a lightweight JavaScript toolkit designed to make creating menus or configs for Userscripts easier.
You can create [Popups](#popups), which are draggable and customizable windows, with many configurable parameters to change their behavior.
USUI also comes with built-in [modules](#modules) to ease development of configuration menus, and have a standard look across browsers on desktop and mobile.

Currently in beta, so there may be bugs and other surprises/updates that change many features dramatically.
I also will try my best to keep backwards compatibility for as long as I can.

* [Docs](#documentation)
  * [Setup](#setup)
  * [Schemas](#schemas)
  * [Notes](#behavior-notes)
  * [Popups](#popups)
    * [createPopup()](#createpopupparams---function)
    * [closeMenu()](#closemenupopup-function)
  * [Modules](#modules)
    * [iRGB](#color-input-irgbparams--)
    * [Building Blocks](#building-blocks)
* [Hello, world! Example](#hello-world-example)
* [Credits](#credits)

## Documentation

### Setup

To use USUI inside of a Userscript, add `@require https://usui.qog.app/lib/USUI.js` to the
metadata block at the top of the Userscript. To inject CSS, use `USUI.spawnCSS()`.
You can also include the source code itself as long as your script adheres to the terms
detailed in the GPLv3 license. This might not matter if it's an open-source/personal Userscript.
You can use USUI in projects that aren't Userscripts as well.

#### Global Defaults

You can change the default position of popups by using the `USUI.defaultpos` array, and changing
the 2 strings of CSS units.

#### Schemas

##### Button Objects

Most if not all button objects in USUI are an object with properties, `text`, `title`, and `action`.

Example:

```javascript
{
    text:"Button",
    title:"Does something",
    action: functionReference
}
```

#### Behavior Notes

* `action` and `event` parameters are the same. `action` is the preferred property for button callbacks. `event` still exists only for backward compatibility.

* `text` and `textContent` are interchangeable. This is because if no `text` parameter is provided, `textContent` can be used to add the text anyways.

* Extra attributes just passthrough. Any additional parameters passed to a function are added as HTML attributes on the element. Some exceptions are listed in their respective sections.

#### Themes

By default, all popups will be using the default USUI theme, `USUI_popup_T_DEFAULT`, which is very
barebones. There is a dark mode version of this theme included if you use `USUI_popup_T_defaultdark`
as the theme for popups.
Themes are also just classes because its simpler and allows extra customizability.

### `USUI` Global Object

* `version: ""`

`USUI.version` returns the version of USUI the script is currently using. This exists to get the version
of USUI you're using to make sure you're up to date, and as metadata.

* `popups: []`

`USUI.popups` is an array containing all popups created using `createPopup`. When a popup is created,
it is added to this array. When a popup is closed using `closeMenu` or `closeAll`, it is removed from
the array.

* `defaultpos: []`

`USUI.defaultpos` is an array containing 2 strings that are positions for the CSS that gets set as the position of new popups. It's default value is `["0","0"]`.

* `popuptheme: ""`

`USUI.popuptheme` defines the default class to apply to all popups created with `createPopup`.
It by default uses `"USUI_popup_T_DEFAULT"`.

* `spawnCSS(params)`

Injects the styles for USUI to work.

#### `spawnCSS` Parameters Object

* `overwrite: false`

Boolean to load CSS anyways regardless of existing USUI.css on the page. By default this is false,
so that multiple Userscripts or webpages that have already loaded the CSS don't override each others
styles.

* `host: ""`

String to load CSS from a specific source URL, the default source is `"https://usui.qog.app/lib/USUI.css"`.

### Popups

Popups are floating windows that you can create that can be dragged around the screen.
You use `createPopup` to create the actual floating window, and using `appendChild`, you can insert
a `createPopupContent` to easily begin creating a popup. You can also manually create the popup's content.

Example of very barebones popup:

```javascript
const popupContainer = USUI.createPopup({
    stay: false, 
    position: ["6%","6%"],
    id: "bbtemplate",
    title: "Building Blocks Template",
    style: "height:auto;",
    buttons: [
        {
            textContent: "X",
            title: "Close Window",
            classes: ["closebtn"],
            event: () => {
                USUI.closeMenu(popupContainer);
            }
        },
    ]
});

const popupContent = USUI.createPopupContent({
    style: "padding: 15px;display: block;flex-direction: column;",
});

popupContainer.appendChild(popupContent);
document.body.appendChild(popupContainer);
```

You should only make popups in a function so that they aren't in the global scope.

#### `createPopup(params = {})` Function

Returns a floating window, and adds popup to `USUI.popups`. By default, all popups are given the theme class, `.USUI_popup_T_DEFAULT` so that themes that don't make use of all properties don't fallback to browser styles. When interacted with, the popup moves forward in space from the default z-index, or layer, `400`.

##### `createPopup` Parameters Object

* `id: "unknownPopup"`

Sets the `id` attribute of the popup. Adding one is highly recommended.

* `stay: false`

If `true`, popup will be placed in the same `position` where the last popup was placed.

* `position: []`

Array that sets the position of the popup, which is 2 string CSS positions, and if none are provided,
it uses the default position, `USUI.defaultpos`.

* `layer: Number`

Sets the z-index of the popup. This disables interacting with popups to move them forward a layer.

* `title: ""`

Sets the title of the popup. Defaults to `"Popup"`.

* `titlebar: true`

Boolean to enable the titlebar at the top of popups. Default is true.
You can have a titlebar even if the popup has no `title`.

* `theme: "USUI_popup_T_DEFAULT"`

Adds class for a theme to use on the popup.

* `fencing: false`

Boolean that keeps the popup from moving offscreen. Make sure your popup can't be bigger than the
screen or extends through the viewport.

* `classes: []`

Array that adds classes to popup.

* `buttons: []`

###### Titlebar Button Array Object Parameters

* `text`

Sets the text on the button.

* `classes:[]`

Array that sets the classes of the button.

* `action`/`event`

The function of the button that runs when clicked.

* Excess parameters are set as attributes of the button.

#### `closeMenu(popup)` Function

Closes a popup element, or if given a string, all popups with the `id` or that have the class passed.

You must pass either a popup element returned when you used `createPopup`, a class used by the popup,
or the `id` of the popup.

#### `closeAll()` Function

Closes all popups in `USUI.popups`. Useful for if your Userscript only uses 1 popup.
Be careful using this, as it may close popups unassociated with your Userscript, made
by other scripts, or by the webpage.

### Modules

Modules are extra elements and functions that allow you to make elements in your UI easier.
All elements have to be appended to the popup content or page using `appendChild()`.

#### Color Input `iRGB(params = {})`

Returns an element, which like the normal color input contains a color chip,
that acts like a color input, but it looks the same on all browsers.
When clicked, it shows a color prompt below the input with sliders for Red, Green, Blue,
and a text input for copying/pasting a hex code, which changes color while changing the value of the sliders or text box. It supports 3 digit (`#abc`), 6 digit hex codes (`#abcdef`), and setting
the values of Red, Green, and Blue as numbers manually.

It does dispatch events for `"change"` and `"input"`, so event listeners work properly.

You must use `.dataset.value` to get the value of the color input, not `.value`.

Example usage:

```javascript
const exampleRGB = USUI.modules.iRGB({
    red: 230, 
    green: 70,
    blue: 149
});
exampleRGB.addEventListener('input',(e)=>{
    console.log(e.target.dataset.value);
});
row1.appendChild(exampleRGB);
```

##### `iRGB()` Parameters Object

* `value: ""`

Sets the `data-value` attribute of the color input. Must be a valid 3/6 digit hex color,
e.g. `#abc` or `#aabbcc`.

* `red: 0`, `green: 0`, and `blue: 0`

Sets the individual RGB values to be used in the value of the color input.
Any exclusions will be set to 0. Values must be numbers and between 0 and 255.

* All excess parameters are set as attributes for the color input element.
* If both `value` and `red`, `green`, or `blue` are passed, the actual RGB values
* take precedent over the hex color.

### Building Blocks

Building Blocks are a set of barebones elements to ease development of configuration or
information menus. They were designed to have limited theming so that you can build off of them.

#### Input `BBinput(params = {})`

Creates a container with a `<label>` and `<input>`.
You can append the container to a popup's content to use as your menus.
Supports most if not all common `<input>` element types.

Returns `[container, input]`, which is both HTML elements.

Example usage:

```javascript
const [exampleText,eginput] = USUI.modules.BBinput({
    id: "exampleInput",
    type:"text",
    label: "Text Input",
    value:"Hello world!",
});
eginput.addEventListener('input',(e)=>{
    console.log(e.target.value);
});
popupContent.appendChild(exampleText);
```

##### `BBinput` Parameters Object

* `type: ""`

Sets the type of input. Default value is `text`.

When set to `color`, it uses an `iRGB()` input element and not `<input type="color">`.
The color module uses `.dataset.value` and not `.value`.

* `label: ""`

Sets the text content of the label element.

* `labelAttributes: {}`

Sets the HTML attributes of the label element.

* `value: String || Number` or `checked: Boolean`

Sets the `value`/`checked` attribute of the input element.

* Excess parameters are set as attributes of the input element.

##### `type: "range"` Parameters Object

Using `<input type="range">` allows many more customizable features to the slider.
Technically, the marks added should be called graduations, but "ticks" is much more concise.

Example usage:

```javascript
const [exampleRange,egrange] = USUI.modules.BBinput({
    id: "exampleRange",
    type:"range",
    label: "Range/Slider",
    value: 10,
    min:0,
    max:100,
    step:5,
    ticks: 5,
    tickSet: true,
    tooltip: true,
});
egrange.addEventListener('change',(e)=>{
    console.log(e.target.value);
});
alertContent.appendChild(exampleRange);
```

* `ticks: 0`

Sets the number of tick marks/graduations shown under the slider. Ticks only
appear if `min` and `max` are provided.

* `tickSet: false`

Boolean to allow clicking on the graduations to change the value of the slider.
Dispatches the events for `"change"` and `"input"` from the input.

* `round: 0`

Number of how many digits after the decimal to show in tick marks. Default is 0.

* `tooltip:false`

Creates a tiny number to preview the value of the input. It will always show the exact value
of the input, and appears when interacting with the slider, or actively sliding the slider.

* `tooltipInput: false`

Creates tiny number input to show exact value of while sliding or clicking on slider,
and can be used to input direct number. Dispatches `"change"` and `"input"` events.
Very buggy in its current state, so using this is not recommended for now.

#### Buttons `BBbuttons(params = {})`

Returns a container for a row of buttons. Useful if you need buttons to open more menus,
or to submit and run functions.

Example usage:

```javascript
popupContent.appendChild(USUI.modules.BBbuttons({
    buttons: [
        {
            text:"Log 2+2",
            title: "Log in the Console 2+2",
            action: ()=>{
                console.log(2+2);
            },
        },
    ]
}));
```

##### `BBbuttons` Parameters Object

Using any parameter that isn't `buttons` will be added to the container as attributes.

* `buttons: []` Buttons

Sets the array of button objects to add.

###### `BBbuttons` Array Button Object Parameters

* `text: ""`

Set the `textContent` of the button.

* `classes: []`

Array that sets the classes of the button.

* `action: ()=>{}`

Sets the event listener `"click"` of the button to a function.

* Excess parameters are set as attributes of the button.

#### Text `BBtext()`

Returns static text block container. Can be used for arbitrary HTML elements, but not
recommended unless using `innerHTML` and you know what you're doing.

Example Usage:

```javascript
popupContent.appendChild(USUI.modules.BBtext({
    tag:"h1",
    text:"Hello!",
}));
```

##### `BBtext` Parameters Object

* `tag: "p"`

Sets the tag of the text element inside the container. Default parameter used is `"p"` for
the paragraph element (`<p>`).

* `text: ""`

Sets the `textContent` of the text element.

* `classes: []`

Sets the classes of the text element.

* `innerHTML: ""`

Replaces the inside of the container with raw HTML elements. If only `innerHTML` is passed
without a `tag` parameter, it overwrites the `text` parameter. All other parameters remain
the same.

* Excess parameters are set as attributes of text element.
* If `innerHTML` is in use without a `tag` parameter, the text container will receive all attributes.

## Hello, world! Example

```javascript
function bbTemplate() {
    const popupContainer = USUI.createPopup({ // first create the actual popup
        stay: false, 
        position: ["6%","6%"],
        id: "bbtemplate",
        title: "Building Blocks Template",
        style: "height:auto;",
        buttons: [
            {
                textContent: "X",
                title: "Close Window",
                classes: ["closebtn"],
                event: () => {
                    USUI.closeMenu(popupContainer);
                }
            },
        ]
    });

    const popupContent = USUI.createPopupContent({ // then create a popup content to contain the building blocks
        style: "padding: 15px;display: block;flex-direction: column;",
    });

    popupContent.appendChild(USUI.modules.BBtext({ // create a header element that says Alert Text Example
        tag:"h1",
        text:"Alert Text Example",
    }));

    const [exampleText,eginput] = USUI.modules.BBinput({ // create label/text container and input
        id: "exampleInput",
        type:"text",
        label: "Text Input",
        value:"Hello world!",
    });
    popupContent.appendChild(exampleText);

    popupContent.appendChild(USUI.modules.BBbuttons({ // create a button that alerts the value of the text input above
        buttons: [
            {
                text:"Alert",
                title: "Alerts the page of the value of the text input",
                action: ()=>{
                    alert(eginput.value);
                },
            },
        ]
    }));

    popupContainer.appendChild(popupContent); // append the popup content to the popup container
    document.body.appendChild(popupContainer); // append the popup to the documents body

    popupContainer.querySelector("button").focus(); // optional: focuses the close button in the titlebar
};
```

## Credits

* [MADE BY CCN0](https://ccn0.net), originally created in 2024
* "UserScript UI" logo, wordmark, and icons use the font [Arimo](https://fonts.google.com/specimen/Arimo) by Steve Matteson.
