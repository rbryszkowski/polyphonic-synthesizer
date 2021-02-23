import React, {useState, useEffect} from 'react';
import {ChordCalculations} from '../../chord-calculations';
import {chordPadStyles} from '../../styles';
import '../../styles.css';

const format = ChordCalculations.formatNote;

export const ChordPad = (props) => {

  function handleMouseDown(e) {
    props.triggerChord(e.currentTarget.id);
  }

  function handleMouseUp(e) {
    props.releaseChord(e.currentTarget.id);
  }

  function formatChord(chordID) {
    const root = props.chordsState[chordID].root;
    const type = props.chordsState[chordID].type;
    return `${format(root)} ${type}`;
  }

  return (
    <div style={chordPadStyles.container}>
    <div className='chord-button-overlay' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} key='chord1' id='chord1'>
      <div
        style={props.chordsState.chord1.isActive ? chordPadStyles.button.active : chordPadStyles.button.inactive}
        className='chordpad-button'
      >
        <h1 className='chord-numeral'>{props.chordsState.chord1.numeral}</h1>
        <h2 className='chord-name'>{formatChord('chord1')}</h2>
      </div>
    </div>

    <div className='chord-button-overlay' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} key='chord2' id='chord2'>
      <div
        style={props.chordsState.chord2.isActive ? chordPadStyles.button.active : chordPadStyles.button.inactive}
        className='chordpad-button'
      >
        <h1 className='chord-numeral'>{props.chordsState.chord2.numeral}</h1>
        <h2 className='chord-name'>{formatChord('chord2')}</h2>
      </div>
    </div>

    <div className='chord-button-overlay' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} key='chord3' id='chord3'>
      <div
        style={props.chordsState.chord3.isActive ? chordPadStyles.button.active : chordPadStyles.button.inactive}
        className='chordpad-button'
      >
        <h1 className='chord-numeral'>{props.chordsState.chord3.numeral}</h1>
        <h2 className='chord-name'>{formatChord('chord3')}</h2>
      </div>
    </div>

    <div className='chord-button-overlay' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} key='chord4' id='chord4'>
      <div
        style={props.chordsState.chord4.isActive ? chordPadStyles.button.active : chordPadStyles.button.inactive}
        className='chordpad-button'
      >
        <h1 className='chord-numeral'>{props.chordsState.chord4.numeral}</h1>
        <h2 className='chord-name'>{formatChord('chord4')}</h2>
      </div>
    </div>

    <div className='chord-button-overlay' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} key='chord5' id='chord5'>
      <div
        style={props.chordsState.chord5.isActive ? chordPadStyles.button.active : chordPadStyles.button.inactive}
        className='chordpad-button'
      >
        <h1 className='chord-numeral'>{props.chordsState.chord5.numeral}</h1>
        <h2 className='chord-name'>{formatChord('chord5')}</h2>
      </div>
    </div>

    <div className='chord-button-overlay' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} key='chord6' id='chord6'>
      <div
        style={props.chordsState.chord6.isActive ? chordPadStyles.button.active : chordPadStyles.button.inactive}
        className='chordpad-button'
      >
        <h1 className='chord-numeral'>{props.chordsState.chord6.numeral}</h1>
        <h2 className='chord-name'>{formatChord('chord6')}</h2>
      </div>
    </div>

    <div className='chord-button-overlay' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} key='chord7' id='chord7'>
      <div
        style={props.chordsState.chord7.isActive ? chordPadStyles.button.active : chordPadStyles.button.inactive}
        className='chordpad-button'
      >
        <h1 className='chord-numeral'>{props.chordsState.chord7.numeral}</h1>
        <h2 className='chord-name'>{formatChord('chord7')}</h2>
      </div>
    </div>
    </div>
  )

}
