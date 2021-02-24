
import React, {useState, useEffect} from 'react';
import {synthParentStyles} from '../../styles';
import {ChordPad} from '../ChordPad/ChordPad';
import {SynthKeys} from '../SynthKeys/SynthKeys';
import {ChordCalculations} from '../../chord-calculations';
import * as Tone from 'tone'; //generate sounds

//variables:
const operatingSys = 'mac'; //different OS have diffent keyCodes for physical keys
const numOctaves = 1;
const middleOctave = 4;
const lowestOctave = middleOctave - Math.floor(numOctaves / 2);
const highestOctave = lowestOctave + numOctaves;
const notes = ["C", "Csh", "D", "Dsh", "E", "F", "Fsh", "G", "Gsh", "A", "Ash", "B"];
const allPitches = [];

let octaveIndex = lowestOctave;
let notesIndex;
for ( let i=0 ; i < 12*numOctaves ; i++ ) {
  notesIndex = i % 12;
  if ( notesIndex === 0 && i !== 0 ) {octaveIndex++};
  allPitches.push(notes[notesIndex] + octaveIndex);
}

/*
new Key-mappings object for configuring mappings based on physical layout and OS

const keyMappings = {
windows: {

},

mac: {

}
}
*/

const keyMappings = {
  //notes
  d: 'C',
  r: 'Csh',
  f: 'D',
  t: 'Dsh',
  g: 'E',
  h: 'F',
  u: 'Fsh',
  j: 'G',
  i: 'Gsh',
  k: 'A',
  o: 'Ash',
  l: 'B',
  //chords
  '1': 'chord1',
  '2': 'chord2',
  '3': 'chord3',
  '4': 'chord4',
  'q': 'chord5',
  'w': 'chord6',
  'e': 'chord7'
}

//module:

export const SynthParent = () => {

  //const [testState, setTestState] = useState(0);
  const [synths, setSynths] = useState(['FMSynth', 'AMSynth', 'DuoSynth']);
  const [keySynth, setKeySynth] = useState(null);
  const [chordSynth, setChordSynth] = useState(null);
  const [keyEvent, setKeyEvent] = useState( { key: '', isDown: false } );
  const [mouseIsDown, setMouseIsDown] = useState(false);

  const [notesState, setNotesState] = useState({
      'C': {isActive: false},
      'Csh': {isActive: false},
      'D': {isActive: false},
      'Dsh': {isActive: false},
      'E': {isActive: false},
      'F': {isActive: false},
      'Fsh': {isActive: false},
      'G': {isActive: false},
      'Gsh': {isActive: false},
      'A': {isActive: false},
      'Ash': {isActive: false},
      'B': {isActive: false}
  });

  const [scale, setScale] = useState( {root:'C', type:'major', tones: ChordCalculations.getScaleTones('C', 'major')} );
  const [chordComplexity, setChordComplexity] = useState(3); //how many notes in a chord
  const chordNumerals = [1,2,3,4,5,6,7].map( number => {return ChordCalculations.getChordNumeral(number, scale.type);});
  const chordNames = ChordCalculations.getChordsInKey(scale.root, scale.type);
  const chordRoots = chordNames.map(chord => chord.split(' ')[0]);
  const chordTypes = chordNames.map(chord => chord.split(' ')[1]);
  const chordNotes = chordNames.map( chord => {
    const root = chord.split(' ')[0];
    const type = chord.split(' ')[1];
    return ChordCalculations.buildChordFromType(root, type);
  });
  const [chordsState, setChordsState] = useState(
    {
      chord1: {isActive: false, name: chordNames[0], root: chordRoots[0], type: chordTypes[0], notes: chordNotes[0], numeral: chordNumerals[0]},
      chord2: {isActive: false, name: chordNames[1], root: chordRoots[1], type: chordTypes[1], notes: chordNotes[1], numeral: chordNumerals[1]},
      chord3: {isActive: false, name: chordNames[2], root: chordRoots[2], type: chordTypes[2], notes: chordNotes[2], numeral: chordNumerals[2]},
      chord4: {isActive: false, name: chordNames[3], root: chordRoots[3], type: chordTypes[3], notes: chordNotes[3], numeral: chordNumerals[3]},
      chord5: {isActive: false, name: chordNames[4], root: chordRoots[4], type: chordTypes[4], notes: chordNotes[4], numeral: chordNumerals[4]},
      chord6: {isActive: false, name: chordNames[5], root: chordRoots[5], type: chordTypes[5], notes: chordNotes[5], numeral: chordNumerals[5]},
      chord7: {isActive: false, name: chordNames[6], root: chordRoots[6], type: chordTypes[6], notes: chordNotes[6], numeral: chordNumerals[6]}
    }
  );

  //functions and event handlers:

  const triggerRandChord = (root) => {
    let chordSelection = ['major', 'minor'];
    let chordRandIndex = Math.floor( Math.random() * chordSelection.length);
    let rootRandIndex = Math.floor( Math.random() * notes.length);
    let chordNotes = ChordCalculations.buildChordFromType(notes[rootRandIndex], chordSelection[chordRandIndex]);
    triggerChord(chordNotes);
  }

  const releaseAllNotes = (synth) => {
    for (let i=0;i<notes.length;i++) {
      releaseNote(notes[i], synth);
    }
  }

  const triggerChord = (chordArr, delay=0, stagger=0) => {
    for (let i=0;i<chordArr.length;i++) {
      triggerNote(chordArr[i], chordSynth, delay);
      delay+=stagger;
    }
  }

  const releaseChord = (chordArr, delay=0) => {
    for (let i=0;i<chordArr.length;i++) {
      releaseNote(chordArr[i], chordSynth, delay);
    }
  }

  const triggerChordAtID = (chordID) => {
    let chordNotes = chordsState[chordID].notes;
    triggerChord(chordNotes);
    //update chords state:
    setChordsState( ({[chordID]:chordObj, ...restChordsState}) => {
      let {isActive, ...restChordObj} = chordObj;
      isActive = true;
      return {
        [chordID]: {isActive: isActive, ...restChordObj},
        ...restChordsState
      }
    } );
  }

  const releaseChordAtID = (chordID) => {
    let chordNotes = chordsState[chordID].notes;
    releaseChord(chordNotes);
    //update chords state:
    setChordsState( ({[chordID]:chordObj, ...restChordsState}) => {
      let {isActive, ...restChordObj} = chordObj;
      isActive = false;
      return {
        [chordID]: {isActive: isActive, ...restChordObj},
        ...restChordsState
      }
    } );
  }

  const handleMouseDown = (elem) => {
    setMouseIsDown(()=>true);
    if (elem.includes('chord')) {
      //chord logic
      triggerChordAtID(elem);
    } else {
      //note logic
      triggerNote(elem, keySynth);
      //update notes state
      setNotesState( ({[elem]:noteObj, ...rest}) => {
        let {isActive} = noteObj;
        isActive = true;
        return {[elem]: {isActive: isActive}, ...rest};
      } );
    }
  }

  const handleMouseUp = (elem) => {
    setMouseIsDown(()=>false);
    if (elem.includes('chord')) {
      //chord logic
      releaseChordAtID(elem);
    } else {
      //note logic
      releaseNote(elem, keySynth);
      //update notes state
      setNotesState( ({[elem]:noteObj, ...rest}) => {
        let {isActive} = noteObj;
        isActive = false;
        return {[elem]: {isActive: isActive}, ...rest};
      } );
    }
  }

  const handleMouseOver = (elem) => {
    if (mouseIsDown && elem.includes('chord')) {
      //chord logic
      triggerChordAtID(elem);
    } else if (mouseIsDown && !elem.includes('chord'))  {
      //note logic
      triggerNote(elem, keySynth);
      //update notes state
      setNotesState( ({[elem]:noteObj, ...rest}) => {
        let {isActive} = noteObj;
        isActive = true;
        return {[elem]: {isActive: isActive}, ...rest};
      } );
    }
  }

  const handleMouseOut = (elem) => {
    if (mouseIsDown && elem.includes('chord')) {
      //chord logic
      releaseChordAtID(elem);
    } else if (mouseIsDown && !elem.includes('chord'))  {
      //note logic
      releaseNote(elem, keySynth);
      //update notes state
      setNotesState( ({[elem]:noteObj, ...rest}) => {
        let {isActive} = noteObj;
        isActive = false;
        return {[elem]: {isActive: isActive}, ...rest};
      } );
    }
  }

  const handleKeyDown = e => {
    if (!keyMappings[e.key]) {return;}
    setKeyEvent({key: e.key, isDown: true});
  }

  const handleKeyUp = e => {
    if (!keyMappings[e.key]) {return;}
    setKeyEvent({key: e.key, isDown: false});
  }

  const triggerNote = (note, synth, delay=0) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#') + middleOctave;
    //console.log('formatted note just before trigger:', formattedNote);
    synth.triggerAttack(formattedNote, now + delay);
  }

  const releaseNote = (note, synth, delay=0) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#') + middleOctave;
    //console.log('formatted note just before release:', formattedNote);
    synth.triggerRelease(formattedNote, now + delay);
  }

  //UseEffects:

  //add event listeners for keyPresses
  useEffect( () => {
    //action
    setKeySynth(new Tone.PolySynth(Tone[synths[0]]).toDestination());
    setChordSynth(new Tone.PolySynth(Tone[synths[1]]).toDestination());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', () => {
      setMouseIsDown(()=>false);
    });
    //cleanup func
    return ( () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.addEventListener('mouseup', () => {
        setMouseIsDown(()=>false);
      });
      if (keySynth) {keySynth.dispose();}
      if (chordSynth) {chordSynth.dispose();}
    } );
  }, []);

  //handle key events
  useEffect(() => {

    if (keyMappings[keyEvent.key]) {
      let chord, note;
      //is the key mapped to a note or a chord?
      if (keyMappings[keyEvent.key].includes('chord')) {
        chord = keyMappings[keyEvent.key];
      } else {
        note = keyMappings[keyEvent.key];
      }
      //trigger note
      if (note && keyEvent.isDown && !notesState[note].isActive) {
        triggerNote(note, keySynth);
        //update notes state
        setNotesState( ({[note]:noteObj, ...rest}) => {
          let {isActive} = noteObj;
          isActive = true;
          return {[note]: {isActive: isActive}, ...rest};
        } );
      }
      //triggerChord
      if (chord && keyEvent.isDown && !chordsState[chord].isActive) {
        triggerChordAtID(chord);
      }
      //release note
      if (note && !keyEvent.isDown) {
        releaseNote(note, keySynth);
        //update notes state
        setNotesState( ({[note]:noteObj, ...rest}) => {
          let {isActive} = noteObj;
          isActive = false;
          return {[note]: {isActive: isActive}, ...rest};
        } );
      }
      //releaseChord
      if (chord && !keyEvent.isDown) {
        releaseChordAtID(chord);
      }

    }

  }, [keyEvent]);

  //render:

  return (
    <div style={synthParentStyles}>
      <ChordPad
      chordsState={chordsState}
      handleMouseUp={handleMouseUp}
      handleMouseDown={handleMouseDown}
      handleMouseOver={handleMouseOver}
      handleMouseOut={handleMouseOut}
      />
      <br/>
      <SynthKeys
      numOctaves={numOctaves}
      lowestOctave={lowestOctave}
      notesState={notesState}
      handleMouseUp={handleMouseUp}
      handleMouseDown={handleMouseDown}
      handleMouseOver={handleMouseOver}
      handleMouseOut={handleMouseOut}
      />
      <br/>
    </div>
  );

}
