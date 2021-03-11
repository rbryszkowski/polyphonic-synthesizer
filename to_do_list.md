# TO DO

Note: Since I'm going to be using the word 'keyboard' and 'key' alot, which could be misinterpreted as the whole of, or part of the synth itself, assume that 'keyboard' and 'key' refer to COMPUTER keyboard. If I am referring to the synth I will say 'synth' and 'note' and not 'keyboard' or 'key'. This duplicate terminology is proving rather annoying, especially as I will also be mentioning musical keys (scales), so hopefully knowing this will avoid alot of confusion.

## immediate:

- Create two new components that handle the chord logic and the keyboard logic, and move the code relevant code from synth parent into these. Create another two components named KeysContainer, and ChordContainer and use these as presentational modules for the keys and chordpad. This will seperate concerns and declutter the synth parent - it will now only handle logic for key events. notes states and chord states will be moved to their new logic modules and key events will be passed down as props to these modules.
- improve style and layout
- add ability to move up/down an octave with assigned keys
- add a 'mini-map' (in a component called KeyboardMap) of the whole keyboard, which highlights which octave(s)/chunk of the keyboard the user is interacting with.
- hovering over a note (without clicking) will highlight the note in a subtle colour and display the note name (with octave number), clicking on the note will highlight it in a darker colour (still displaying the note name).
- add more scales and chords

## future features:

- add an effects selector
- add a synth selector
- add a musical key selector for chords, consisting of a root-note selector and a scale selector
  - add an option for randomly generated chords
- add ability to flatten/sharpen chords with assigned keys
- add ability to switch a chord from major/minor with assigned keys
- add ability to move up/down an octave with assigned keys
- add a drum/sample pad with keyboard control, with ability to import custom samples
