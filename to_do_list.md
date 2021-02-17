# TO DO

Note: Since I'm going to be using the word 'keyboard' and 'key' alot, which could be misinterpreted as the whole of, or part of the synth itself, assume that 'keyboard' and 'key' refer to COMPUTER keyboard. If I am referring to the synth I will say 'synth' and 'note' and not 'keyboard' or 'key'. This duplicate terminology is proving rather annoying, especially as I will also be mentioning musical keys (scales), so hopefully knowing this will avoid alot of confusion.

## immediate:

- fix error with notes not releasing
- move all js styles to css styles and change code accordingly
- add keyboard control for chordpad
- add a mouseup event listener to window which stops all notes playing when the mouse-button is released
- add an onmouseout event listener to notes and chords to release the chord/note when the cursor moves off it.
- add mouseup state to synth parent, then add an onmouseover event to keys/chords so that they trigger ONLY IF the cursor is over them AND the mouse-button is down.
- improve style and layout


## future features:

- add an effects selector
- add a synth selector
- add a musical key selector for chords, consisting of a root-note selector and a scale selector
  - add an option for randomly generated chords
- add ability to flatten/sharpen chords with assigned keys
- add ability to switch a chord from major/minor with assigned keys
- add ability to move up/down an octave with assigned keys
- add a drum/sample pad with keyboard control, with ability to import custom samples
