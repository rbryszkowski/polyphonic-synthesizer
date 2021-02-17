
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
    'C': {isActive: false, repeatTriggers: 0}, //repeatTriggers counts how many times the note has been retriggered before release, only notes with value 1 will be played
    'Csh': {isActive: false, repeatTriggers: 0},
    'D': {isActive: false, repeatTriggers: 0},
    'Dsh': {isActive: false, repeatTriggers: 0},
    'E': {isActive: false, repeatTriggers: 0},
    'F': {isActive: false, repeatTriggers: 0},
    'Fsh': {isActive: false, repeatTriggers: 0},
    'G': {isActive: false, repeatTriggers: 0},
    'Gsh': {isActive: false, repeatTriggers: 0},
    'A': {isActive: false, repeatTriggers: 0},
    'Ash': {isActive: false, repeatTriggers: 0},
    'B': {isActive: false, repeatTriggers: 0}
}


//module:

export const SynthParent = () => {

  const userSynth = new Tone.PolySynth(Tone.FMSynth).toDestination();

  const [notesState, setNotesState] = useState(initialNotesState);
  const [lastNoteTriggered, setLastNoteTriggered] = useState('');
  const [lastNoteReleased, setLastNoteReleased] = useState('');
  //const [octaveIndex, setOctaveIndex] = useState(middleOctave);
  //const [synth, setSynth] = useState(null);
  //const [fxArray, setFxArray] = useState(null);
  const [scale, setScale] = useState( {root:'C', type:'major', tones: ChordCalculations.getScaleTones('C', 'major')} );
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
    for (let i=0;i<notes.length;i++) { // release all notes (not just in chord)
      releaseNote(notes[i]);
    }
  }

  const triggerChord = (chordArr) => {
    for (let i=0;i<chordArr.length;i++) {
      triggerNote(chordArr[i]);
    }
  }

  const releaseChord = (chordArr) => {
    for (let i=0;i<chordArr.length;i++) {
      releaseNote(chordArr[i]);
    }
  }

  const triggerChordAtID = (chordID) => {
    let chordNotes = chordsState[chordID].notes;
    triggerChord(chordNotes);
    ///*
    //update chord state:
    setChordsState( ({[chordID]:chordObj, ...restChordsState}) => {
      let {isActive, ...restChordObj} = chordObj;
      isActive = true;
      return {
        [chordID]: {isActive, ...restChordObj},
        ...restChordsState
      }
    } );
    //*/
  }

  useEffect(() => {
    console.log(chordsState);
  }, [chordsState]);

  const releaseChordAtID = (chordID) => {
    let chordNotes = chordsState[chordID].notes;
    releaseChord(chordNotes);
    //userSynth.triggerRelease(['C4', 'E4', 'G4'], Tone.now());
    ///*
    //update chord state:
    setChordsState( ({[chordID]:chordObj, ...restChordsState}) => {
      let {isActive, ...restChordObj} = chordObj;
      isActive = false;
      return {
        [chordID]: {isActive, ...restChordObj},
        ...restChordsState
      }
    } );
    //*/
  }

  const handleMouseDown = (note) => {
    setLastNoteTriggered(note);
    setNotesState( ({[note]:prevNoteProperties, ...rest}) => {
      let {isActive, repeatTriggers} = prevNoteProperties;
      isActive = true;
      repeatTriggers += 1;
      const newNotesState = {
        [note]: {isActive, repeatTriggers: repeatTriggers},
        ...rest
      }
      return newNotesState;
    } );
  }

  const handleMouseUp = (note) => {
    setLastNoteReleased(note);
    setNotesState( ({[note]:prevNoteProperties, ...rest}) => {
      let {isActive, repeatTriggers} = prevNoteProperties;
      isActive = false;
      repeatTriggers = 0;
      const newNotesState = {
        [note]: {isActive: isActive, repeatTriggers: repeatTriggers},
        ...rest
      }
      return newNotesState;
    } );
  }

  const handleMouseOver = note => {

  }

  const handleMouseOut = note => {

  }

  const handleKeyDown = e => {
    if (!keyMappings[e.key]) {return;}
    const note = keyMappings[e.key];
    setLastNoteTriggered(note);
    setNotesState( ({[note]:prevNoteProperties, ...rest}) => {
      let {isActive, repeatTriggers} = prevNoteProperties;
      isActive = true;
      repeatTriggers += 1;
      const newNotesState = {
        [note]: {isActive: isActive, repeatTriggers: repeatTriggers},
        ...rest
      }
      return newNotesState;
    } );
  }

  const handleKeyUp = e => {
    if (!keyMappings[e.key]) {return;}
    const note = keyMappings[e.key];
    setLastNoteReleased(note);
    setNotesState( ({[note]:prevNoteProperties, ...rest}) => {
      let {isActive, repeatTriggers} = prevNoteProperties;
      isActive = false;
      repeatTriggers = 0;
      const newNotesState = {
        [note]: {isActive: isActive, repeatTriggers: repeatTriggers},
        ...rest
      }
      return newNotesState;
    } );
  }

  const triggerNote = (note) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#') + middleOctave;
    console.log('formatted note just before trigger:', formattedNote);
    userSynth.triggerAttack(formattedNote, now);
  }

  const releaseNote = (note) => {
    let now = Tone.now();
    let formattedNote = note.replace('sh', '#') + middleOctave;
    console.log('formatted note just before release:', formattedNote);
    userSynth.triggerRelease(formattedNote, now);
  }

  const handleLastNoteTriggered = (note) => {
    if (note && notesState[note].repeatTriggers < 2) { // if there have been any notes triggered at all, and the note hasn't been retriggered before release
      triggerNote(note);
    }
  }

  const handleLastNoteReleased = (note) => {
    if (note) {
      releaseNote(note);
    }
  }

  //UseEffects:

  //add event listeners for keyPresses

  useEffect( () => {
    //action
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    //cleanup func
    return ( () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    } );
  }, []);

  //trigger notes

  useEffect(() => {

    console.log('last triggered:', lastNoteTriggered)
    handleLastNoteTriggered(lastNoteTriggered);

  }, [lastNoteTriggered]);

  //release notes

  useEffect(() => {

    console.log('last released:', lastNoteReleased);
    handleLastNoteReleased(lastNoteReleased);

  }, [lastNoteReleased]);

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
