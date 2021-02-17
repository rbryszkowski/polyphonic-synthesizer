
import React from 'react';
import {synthKeysStyles} from '../../styles';


export const SynthSingleKey = (props) => {

  const handleMouseDown = e => {
    props.handleMouseDown(e.target.id);
  }

  const handleMouseUp = e => {
    props.handleMouseUp(e.target.id);
  }

  const handleMouseOver = e => {
    props.handleMouseOver(e.target.id);
  }

  const handleMouseOut = e => {
    props.handleMouseOut(e.target.id);
  }

  const note = props.pitch.slice(0,-1);

  const calculateStyle = () => {
    const isSharp = note.match(/sh/) ? true : false;
    const keyStyle = isSharp ? synthKeysStyles.sharps[note] : synthKeysStyles.naturals;
    const backgroundColor = props.keyIsActive ? "#00FF00" : keyStyle.backgroundColor;
    return { ...keyStyle, backgroundColor:backgroundColor };
  }

  return (
    <div
      id={note}
      style={calculateStyle()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}>
      </div>
  );

}
