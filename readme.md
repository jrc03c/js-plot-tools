`js-plot-tools` is a library built on top of [`js-math-tools`](https://github.com/jrc03c/js-math-tools).

---

# Installation

```bash
npm install --save https://github.com/jrc03c/js-plot-tools
```

---

# Usage

Node:

```js
const { Plotter } = require("@jrc03c/js-plot-tools")
const { range, pow } = require("@jrc03c/js-math-tools")
const plot = new Plotter()
const x = range(-1, 1, 0.01)
const y = pow(x, 3)
plot.line(x, y)
plot.show()
```

Browser:

```html
<div id="plot"></div>
<script src="path/to/dist/js-plot-tools.js"></script>
<script src="path/to/dist/js-math-tools.js"></script>
<script>
  const { sin, normal } = JSMathTools
  const plot = new Plotter("#plot")
  const x = normal(1000)
  const y = sin(x)
  plot.scatter(x, y)
  plot.show()
</script>
```

---

# API

## `AbstractPlotter`

This is an abstract class whose `.show()` method must be overridden in a subclass. Both the `NodePlotter` and `BrowserPlotter` classes extend this class.

### Properties

#### `.instructions`

The list of drawing instructions.

#### `.shouldDrawAxes`

A boolean indicating whether or not axes should be drawn. If `false`, then tick marks will not be drawn either, even if `.shouldDrawTickMarks` is set to `true`. It's `true` by default.

#### `.shouldDrawTickMarks`

A boolean indicating whether or not tick marks should be drawn on the axes. Currently, tick marks are calculated automatically and cannot be set manually. It's `true` by default.

#### `.shouldSetBoundsAutomatically`

A boolean indicating whether or not display bounds should be computed automatically. It's `true` by default.

#### `.padding`

The number of pixels around the drawing in the canvas.

### Methods

#### `.clear()`

Clears the `.instructions` list.

#### `.dehydrate()`

Returns a stringified version of the `NodePlotter` instance.

#### `.setBounds(xmin, xmax, ymin, ymax)`

Sets the display bounds of the plot.

#### `.scatter(x, y)`

Adds a scatter plot to the list of drawing instructions given one-dimensional lists of _x_- and _y_-values.

#### `.line(x, y)`

Adds a line plot to the list of drawing instructions given one-dimensional lists of _x_- and _y_-values.

#### `.hist(x, bins=20)`

Adds a histogram to the list of drawing instructions given a one-dimensional list of _x_-values.

#### `.show()`

This function will throw an error. It must be overridden in a subclass.

---

## `NodePlotter` (extends `AbstractPlotter`)

This is the class that's used in Node. When you import the library from Node, the class will just be called `Plotter`, but you can import this class directly if you want to, like this:

```js
const { NodePlotter } = require("@jrc03c/js-plot-tools/src/node-plotter.js")
const plot = new NodePlotter()
// ...
```

### Methods

#### `.show()`

Overrides the `AbstractPlotter.show()` method. It dumps the dehydrated copy of itself and a copy of the library into an HTML file and opens that file in the OS's default browser. At that point, the `BrowserPlotter` class will automatically take over and actually execute the drawing instructions.

### Examples

```js
const { plot } = require("@jrc03c/js-plot-tools")
const { range, sin } = require("@jrc03c/js-math-tools")
const x = range(-Math.PI * 2, Math.PI * 2, 0.01)
const y = sin(x)
plot.line(x, y)
plot.show()
```

---

## `BrowserPlotter` (extends `AbstractPlotter`)

This is the class that's used in the browser. When you load the library in the browser, the class will just be called `Plotter` and will be globally available. Also, a global `plot` object will be available in the browser. The former is useful for when you want multiple plots on the same page; the latter is useful if you just want to draw on the entire page. The constructor optionally accepts an `HTMLElement` or a selector string; if no argument is passed, then `document.body` will be used.

### Properties

#### `.element`

The `HTMLElement` that was specified by the constructor argument.

#### `.left`

Defines the left-most possible value to be drawn on the _x_-axis. By default, it's -1. It can either be assigned manually or set via the `setBounds(xmin, xmax, ymin, ymax)` method.

#### `.right`

Defines the right-most possible value to be drawn on the _x_-axis. By default, it's 1. It can either be assigned manually or set via the `setBounds(xmin, xmax, ymin, ymax)` method.

#### `.bottom`

Defines the bottom-most possible value to be drawn on the _y_-axis. By default, it's -1. It can either be assigned manually or set via the `setBounds(xmin, xmax, ymin, ymax)` method.

#### `.top`

Defines the top-most possible value to be drawn on the _y_-axis. By default, it's 1. It can either be assigned manually or set via the `setBounds(xmin, xmax, ymin, ymax)` method.

### Methods

#### `.hydrate(obj)` [static]

This static method returns a `BrowserPlotter` given a previously dehydrated plotter instance. For example (in the browser):

```js
const plot1 = new Plotter()
const plot2 = Plotter.hydrate(plot1.dehydrate())
```

Normally, though, you wouldn't dehydrate a `BrowserPlotter` instance and then rehydrate it. Instead, the usual workflow is that you'd dehydrate a `NodePlotter` instance, save that stringified data somewhere, load that data into the browser, and then use `Plotter.hydrate(obj)` (keeping in mind that `BrowserPlotter` is just called `Plotter` in the browser!) to return a plotter instance that has the same properties as the `NodePlotter` instance.

To clarify, you don't have to use both `NodePlotter` and `BrowserPlotter` in conjunction; they can be used independently of each other (though, of course, `NodePlotter` secretly relies on `BrowserPlotter`).

#### `.show()`

Overrides the `AbstractPlotter.show()` method. It executes all of the instructions in the `.instructions` list.

There's an important thing to keep in mind here: the dimensions of the plot will match the dimensions of `.element`, which will be retrieved when `.show()` is called. If `.element` represents an empty, unstyled element, then your plot may end up having a height of 0, in which case it won't be visible. The solution is to give `.element` some width and height via CSS _before_ calling the `.show()` method.
