
import React, {useState, useEffect} from 'react';
import {synthParentStyles} from '../../styles';
import {ChordPad} from '../ChordPad/ChordPad';
import {SynthKeys} from '../SynthKeys/SynthKeys';
import {ChordCalculations} from '../../chord-calculations';
import * as Tone from 'tone'; //generate sounds

//variables:
const operatingSys = 'mac'; //different OS have diffent keyCodes for physical keys

const notes = ["C", "Csh", "D", "Dsh", "E", "F", "Fsh", "G", "Gsh", "A", "Ash", "B"];

//full keyboard range
const allPitches = ChordCalculations.notesInRange('C2','B6');

//user uses 2 octaves of whole keyboard
//initial range = C4 - B5
const numOctaves = 2;

/*
new Key-mappings object for configuring mappings based on key codes and OS

const keyMappings = {
windows: {notes[], chords:[]}

mac: {notes:[], chords:[]}
};
*/

const keysUsedForNotes = ['q' , '2' , 'w' , '3' , 'e' , 'r' , '5' , 't' , '6' , 'y' , '7' , 'u' , 'i' , '9' , 'o' , '0' , 'p' , '[' , '=' , ']' , 'a' , 'z' , 's' , 'x'];
const keysUsedForChords = ['c' , 'v' , 'b' , 'n' , 'm' , ',' , '.'];

const initLowOctave = 3;
const initHighOctave = initLowOctave + numOctaves - 1;
const initPitchRange = ChordCalculations.notesInRange('C' + initLowOctave, 'B' + initHighOctave);

let initKeyMappings = {notes:{}, chords:{}};

for (let i = 0; i < keysUsedForNotes.length; i++) {
  initKeyMappings.notes[keysUsedForNotes[i]] = initPitchRange[i];
}
for (let i = 0; i < keysUsedForChords.length; i++) {
  initKeyMappings.chords[keysUsedForChords[i]] = 'chord' + (i + 1);
}

//MODULE:

export const SynthParent = () => {

  //RANGE & KEY MAPPINGS

  const [lowOctave, setLowOctave] = useState(initLowOctave);
  const [highOctave, setHighOctave] = useState(initHighOctave);
  const [userPitchRange, setUserPitchRange] = useState(initPitchRange);
  const [keyMappings, setKeyMappings] = useState(initKeyMappings);

  //NOTES

  const initialNotesState = {};
  for (let i = 0; i < userPitchRange.length; i++) {
    initialNotesState[userPitchRange[i]] = {isActive: false};
  }
  const [notesState, setNotesState] = useState(initialNotesState);

  //CHORDS

  const chordsLowOctave = 3;
  const [scale, setScale] = useState( {root:'C', type:'major', tones: ChordCalculations.getScaleTones('C', 'major')} );
  const [chordComplexity, setChordComplexity] = useState(3); //how many notes in a chord
  const chordNumerals = [1,2,3,4,5,6,7].map( number => {return ChordCalculations.getChordNumeral(number, scale.type);});
  const chordNames = ChordCalculations.getChordsInKey(scale.root, scale.type);
  const chordRoots = chordNames.map(chord => chord.split(' ')[0]);
  const chordTypes = chordNames.map(chord => chord.split(' ')[1]);
  //const chordStart = scale.root + chordOctave; //lowest note of first chord
  //const chordsRange = allPitches.slice(allPitches.indexOf(chordStart));
  const chordNotes = chordNames.map( (chord, i) => {
    let nonIndexedNotes = ChordCalculations.buildChordFromType(chordRoots[i], chordTypes[i]);
    return ChordCalculations.addOctaves(chordsLowOctave, nonIndexedNotes);
  } );

  console.log('chordNotes = ', chordNotes);

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

  //OTHER

  const [synths, setSynths] = useState(['FMSynth', 'AMSynth', 'DuoSynth']);
  const [keySynth, setKeySynth] = useState(null);
  const [chordSynth, setChordSynth] = useState(null);
  const [keyEvent, setKeyEvent] = useState( { key: '', isDown: false } );
  const [mouseIsDown, setMouseIsDown] = useState(false);

  //functions and event handlers:

  const triggerNote = (note, synth, delay=0) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#');
    synth.triggerAttack(formattedNote, now + delay);
  }

  const releaseNote = (note, synth, delay=0) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#');
    synth.triggerRelease(formattedNote, now + delay);
  }

  const releaseAllNotes = (synth) => {
    for (let i=0;i<notes.length;i++) {
      releaseNote(notes[i], synth);
    }
  }

  const activateKey = (note) => {
      triggerNote(note, keySynth);

    //update notes state
    setNotesState( (prev) => {
      return {...prev,[note]: {isActive: true}};
    } );
  }

  const deactivateKey = (note) => {
    releaseNote(note, keySynth);
    //update notes state
    setNotesState( (prev) => {
      return {...prev, [note]: {isActive: false}};
    } );
  }

  const triggerRandChord = (root) => {
    let chordSelection = ['major', 'minor'];
    let chordRandIndex = Math.floor( Math.random() * chordSelection.length );
    let rootRandIndex = Math.floor( Math.random() * notes.length );
    let chordNotes = ChordCalculations.buildChordFromType(notes[rootRandIndex], chordSelection[chordRandIndex]);
    triggerChord(chordNotes);
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

  const activateChord = (chordID) => {
    let chordNotes = chordsState[chordID].notes;
    triggerChord(chordNotes);
    //update chords state:
    setChordsState( (prev) => {
      const {isActive, ...rest} = prev[chordID];
      return {...prev, [chordID]: {isActive: true, ...rest}}
    } );
  }

  const deactivateChord = (chordID) => {
    let chordNotes = chordsState[chordID].notes;
    releaseChord(chordNotes);
    //update chords state:
    setChordsState( (prev) => {
      const {isActive, ...rest} = prev[chordID];
      return {...prev, [chordID]: {isActive: false, ...rest}}
    } );
  }

  const handleMouseDown = (id) => {
    setMouseIsDown(()=>true);
    if (id.includes('chord')) {
      activateChord(id);
    } else {
      activateKey(id);
    }
  }

  const handleMouseUp = (id) => {
    setMouseIsDown(()=>false);
    if (id.includes('chord')) {
      deactivateChord(id);
    } else {
      deactivateKey(id);
    }
  }

  const handleMouseOver = (id) => {
    if (mouseIsDown && id.includes('chord')) {
      activateChord(id);
    } else if (mouseIsDown && !id.includes('chord'))  {
      activateKey(id);
    }
  }

  const handleMouseOut = (id) => {
    if (mouseIsDown && id.includes('chord')) {
      deactivateChord(id);
    } else if (mouseIsDown && !id.includes('chord'))  {
      deactivateKey(id);
    }
  }

  const handleKeyDown = e => {
    if (keyMappings.notes[e.key] || keyMappings.chords[e.key] ) {
      setKeyEvent({key: e.key, isDown: true});
    }
  }

  const handleKeyUp = e => {
    if (keyMappings.notes[e.key] || keyMappings.chords[e.key] ) {
      setKeyEvent({key: e.key, isDown: false});
    }
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

    //keyboard mappings
    if (keyMappings.notes[keyEvent.key]) {

      let note = keyMappings.notes[keyEvent.key]

      //trigger key
      if (keyEvent.isDown && !notesState[note].isActive) {
        activateKey(note);
      }

      //release key
      if (!keyEvent.isDown) {
        deactivateKey(note);
      }

    }

    //chordpad mappings
    if (keyMappings.chords[keyEvent.key]) {

      let chord = keyMappings.chords[keyEvent.key]

      //trigger chord
      if (keyEvent.isDown && !chordsState[chord].isActive) {
        activateChord(chord);
      }

      //release chord
      if (!keyEvent.isDown) {
        deactivateChord(chord);
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
      lowOctave={lowOctave}
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
