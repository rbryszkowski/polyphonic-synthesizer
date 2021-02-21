
import React, {useState, useEffect} from 'react';
import {synthParentStyles} from '../../styles';
import {ChordPad} from '../ChordPad/ChordPad';
import {SynthKeys} from '../SynthKeys/SynthKeys';
import {ChordCalculations} from '../../chord-calculations';
import * as Tone from 'tone'; //generate sounds

//variables:

const numOctaves = 1;
const middleOctave = 4;
const lowestOctave = middleOctave - Math.floor(numOctaves / 2);
const notes = ["C", "Csh", "D", "Dsh", "E", "F", "Fsh", "G", "Gsh", "A", "Ash", "B"];

const keyMappings = {
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
  l: 'B'
}

const initialNotesState = {
    'C': {isActive: false}, //repeatTriggers counts how many times the note has been retriggered before release
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
}


//module:

export const SynthParent = () => {

  //const [testState, setTestState] = useState(0);
  const [synths, setSynths] = useState(['FMSynth', 'AMSynth', 'DuoSynth']);
  const [userSynth, setUserSynth] = useState(null); //loaded on mount, see effects
  const [notesState, setNotesState] = useState(initialNotesState);
  const [keyEvent, setKeyEvent] = useState( { key: '', isDown: false } );

  const [scale, setScale] = useState( {root:'C', type:'minor', tones: ChordCalculations.getScaleTones('C', 'minor')} );
  const [chordComplexity, setChordComplexity] = useState(3); //how many notes in a chord
  const chordNumerals = [1,2,3,4,5,6,7].map( number => {return ChordCalculations.getChordNumeral(number, scale.type);});
  const chordNames = ChordCalculations.getChordsInKey(scale.root, scale.type);
  const chordNotes = chordNames.map( chord => {
    const root = chord.split(' ')[0];
    const type = chord.split(' ')[1];
    return ChordCalculations.buildChordFromType(root, type);
  });
  const [chordsState, setChordsState] = useState(
    {
      chord1: {isActive: false, name: chordNames[0], notes: chordNotes[0], numeral: chordNumerals[0]},
      chord2: {isActive: false, name: chordNames[1], notes: chordNotes[1], numeral: chordNumerals[1]},
      chord3: {isActive: false, name: chordNames[2], notes: chordNotes[2], numeral: chordNumerals[2]},
      chord4: {isActive: false, name: chordNames[3], notes: chordNotes[3], numeral: chordNumerals[3]},
      chord5: {isActive: false, name: chordNames[4], notes: chordNotes[4], numeral: chordNumerals[4]},
      chord6: {isActive: false, name: chordNames[5], notes: chordNotes[5], numeral: chordNumerals[5]},
      chord7: {isActive: false, name: chordNames[6], notes: chordNotes[6], numeral: chordNumerals[6]}
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

  const releaseAllNotes = (root) => {
    for (let i=0;i<notes.length;i++) {
      releaseNote(notes[i]);
    }
  }

  const triggerChord = (chordArr, delay=0, stagger=0) => {
    for (let i=0;i<chordArr.length;i++) {
      triggerNote(chordArr[i], delay);
      delay+=stagger;
    }
  }

  const releaseChord = (chordArr, delay=0) => {
    for (let i=0;i<chordArr.length;i++) {
      releaseNote(chordArr[i], delay);
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

  const handleMouseDown = (note) => {
    triggerNote(note);
    //update notes state
    setNotesState( ({[note]:noteObj, ...rest}) => {
      let {isActive} = noteObj;
      isActive = true;
      return {[note]: {isActive: isActive}, ...rest};
    } );
  }

  const handleMouseUp = (note) => {
    releaseNote(note);
    //update notes state
    setNotesState( ({[note]:noteObj, ...rest}) => {
      let {isActive} = noteObj;
      isActive = false;
      return {[note]: {isActive: isActive}, ...rest};
    } );
  }

  const handleMouseOver = note => {

  }

  const handleMouseOut = note => {

  }

  const handleKeyDown = e => {
    if (!keyMappings[e.key]) {return;}
    setKeyEvent({key: e.key, isDown: true});
  }

  const handleKeyUp = e => {
    if (!keyMappings[e.key]) {return;}
    setKeyEvent({key: e.key, isDown: false});
  }

  const triggerNote = (note, delay=0) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#') + middleOctave;
    console.log('formatted note just before trigger:', formattedNote);
    userSynth.triggerAttack(formattedNote, now + delay);
  }

  const releaseNote = (note, delay=0) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#') + middleOctave;
    console.log('formatted note just before release:', formattedNote);
    userSynth.triggerRelease(formattedNote, now + delay);
  }


  //UseEffects:

  //add event listeners for keyPresses

  useEffect( () => {
    //action
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    setUserSynth(new Tone.PolySynth(Tone[synths[0]]).toDestination());
    //cleanup func
    return ( () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (userSynth) {userSynth.dispose();}
    } );
  }, []);

  //handle key events

  useEffect(() => {

    console.log(keyEvent)
    //console.log(notesState);

    if (keyEvent.key) {
      const note = keyMappings[keyEvent.key];
      //trigger if
      if (keyEvent.isDown && !notesState[note].isActive) {
        triggerNote(note);
        //update notes state
        setNotesState( ({[note]:noteObj, ...rest}) => {
          let {isActive} = noteObj;
          isActive = true;
          return {[note]: {isActive: isActive}, ...rest};
        } );
      }
      //release if
      if (!keyEvent.isDown) {
        releaseNote(note);
        //update notes state
        setNotesState( ({[note]:noteObj, ...rest}) => {
          let {isActive} = noteObj;
          isActive = false;
          return {[note]: {isActive: isActive}, ...rest};
        } );
      }
    }


  }, [keyEvent]);

  //render:

  return (
    <div style={synthParentStyles}>
      <ChordPad
      triggerChord={triggerChordAtID}
      releaseChord={releaseChordAtID}
      chordsState={chordsState}
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
      <button className='start-audio-button' onClick={() => {Tone.start()}}>START AUDIO</button>
    </div>
  );

}
