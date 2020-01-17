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

### Usage
1. add classes 'scrl' and 'scrl-<ID>' (fx 'scrl-a') to targeted Scroll blocks
2. create Composition block for progress display area and add class 'sbar-<ID>' (fx 'sbar-a')
3. create another Composition block within the one just created as progress display thumb / fill and add class 'sbar-thumb' 
