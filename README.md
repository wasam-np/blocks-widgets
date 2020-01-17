# Generic Widgets for PIXIlab Blocks
* A collection of useful widgets for PIXIlab Blocks

## Using a widget
1. create a Composition block (fx 10x10 px^2; give it a descriptive & short name )
2. create a Widget block inside
3. copy & paste content of _widget.html_ into Widget block's _HTML Code_ field
4. use Composition block via Reference block where needed
5. more specific instructions for each widget below:

### Scrl
Scroll progress indicators (for Scroll blocks)
- horizontal / vertical progress fill (classic _progress bar_)
- vertical / horizontal scroll bar (like a scroll bar, but __non-interactive__)

#### Preparation
1. create Composition block as described above
2. add Reference block to Composition block at the end of each block where progress indicators shall be used

#### Usage
1. add classes `scrl` and `scrl-<ID>` (fx `scrl-a`) to targeted Scroll blocks
2. create Composition block for progress display area and add class `sbar-<ID>` (fx `sbar-a`)
3. create another Composition block within the one just created as progress display thumb / fill and add class `sbar-thumb` 

### Taps
Make screen touches/clicks affect elements

For example 
* Hide / show elements when interacting with a button
* Change style of elements when touching an area

#### Preparation
1. create Composition block as described above
2. add Reference block to Composition block at the end of each block where touch/click reactions shall be used

#### Usage
1. add classes `taps` and `taps-<ID>` (fx `taps-a`) to targeted elements (fx Button)
2. add class `tapr-<ID>` (fx `tapr-a`) to elements that should react when a targeted element is touched/ clicked
  * default behaviour is for elements to be hidden by default until a touch/click happens
  * add class `tapr-hide` in order for elements to hide when a touch/click happens (and to make them visible by default)
  * add class `tapr-c-<CLASS NAME>` (fx `tapr-c-red`) in order to to add a class `<CLASS NAME>` (fx `red`) to an element when a touch/click happens (and remove the same class by default)
