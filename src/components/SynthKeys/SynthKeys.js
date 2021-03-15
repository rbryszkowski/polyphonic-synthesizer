
import React from 'react';
import {synthKeysStyles} from '../../styles';
import {SynthSingleKey} from '../SynthSingleKey/SynthSingleKey';

/*//////////////////////////////////////////////////*

import { useState, useEffect } from 'react';
import { ChordCalculations } from '../../chord-calculations';

const initLowOctave = 3;
const initHighOctave = initLowOctave + numOctaves - 1;
const initPitchRange = ChordCalculations.notesInRange('C' + initLowOctave, 'B' + initHighOctave);
const initNotesState = {};

initPitchRange.forEach(item => (initNotesState[item] = { isActive: false })); //populate initNotesState

const synths = ['FMSynth', 'AMSynth', 'DuoSynth'];

//////////////////////////////////////////////////*/


export const SynthKeys = (props) => {

    /*/////////////////////////////////////////////////*

    const [synth, setSynth] = new Tone.PolySynth( Tone[ synths[1] ] ).toDestination();
    const [lowOctave, setLowOctave] = useState(initLowOctave);
    const [highOctave, setHighOctave] = useState(initHighOctave);
    const [userPitchRange, setUserPitchRange] = useState(initPitchRange);
    const [notesState, setNotesState] = useState(initNotesState);

    //functions and event handlers:

    const triggerNote = (note, synth, delay = 0) => {
        let now = Tone.now();
        let formattedNote = note.replace('sh', '#');
        synth.triggerAttack(formattedNote, now + delay);
    }

    const releaseNote = (note, synth, delay = 0) => {
        let now = Tone.now();
        let formattedNote = note.replace('sh', '#');
        synth.triggerRelease(formattedNote, now + delay);
    }

    const activateKey = (note) => {
        triggerNote(note, keySynth);

        //update notes state
        setNotesState((prev) => {
            return { ...prev, [note]: { isActive: true } };
        });
    }

    const deactivateKey = (note) => {
        releaseNote(note, keySynth);
        //update notes state
        setNotesState((prev) => {
            return { ...prev, [note]: { isActive: false } };
        });
    }

    const handleMouseDown = (id) => {
        setMouseIsDown(() => true);
        if (id.includes('chord')) {
            activateChord(id);
        } else {
            activateKey(id);
        }
    }

    const handleMouseUp = (id) => {
        setMouseIsDown(() => false);
        if (id.includes('chord')) {
            deactivateChord(id);
        } else {
            deactivateKey(id);
        }
    }

    const handleMouseOver = (id) => {
        if (mouseIsDown && id.includes('chord')) {
            activateChord(id);
        } else if (mouseIsDown && !id.includes('chord')) {
            activateKey(id);
        }
    }

    const handleMouseOut = (id) => {
        if (mouseIsDown && id.includes('chord')) {
            deactivateChord(id);
        } else if (mouseIsDown && !id.includes('chord')) {
            deactivateKey(id);
        }
    }

    /////////////////////////////////////////////////////*/

  const notes = ["C", "Csh", "D", "Dsh", "E", "F", "Fsh", "G", "Gsh", "A", "Ash", "B"];

  const renderKeys = () => {
    const numOctaves = Number(props.numOctaves);
    let lowOctave = Number(props.lowOctave);
    let octaveIndex = lowOctave;
    let contents = [];

    for(let o=0;o<numOctaves;o++) {
      let octave = [];
      for (let i=0;i<notes.length;i++) {
        octave.push(
          (<SynthSingleKey
              pitch={notes[i] + octaveIndex}
              key={notes[i] + octaveIndex}
              keyIsActive={props.notesState[notes[i] + octaveIndex].isActive}
              handleMouseDown={props.handleMouseDown}
              handleMouseUp={props.handleMouseUp}
              handleMouseOver={props.handleMouseOver}
              handleMouseOut={props.handleMouseOut}
           />)
        );
      }
      contents.push(<div key={`octave${octaveIndex}`} style={synthKeysStyles.octaveContainer}>{octave}</div>);
      octaveIndex++;
    }

    return contents;
  }

  return <div style={synthKeysStyles.keysContainer}>{renderKeys()}</div>;

}
