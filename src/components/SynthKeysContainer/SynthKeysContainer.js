﻿
import React from 'react';
import { synthKeysStyles } from '../../styles';
import { SynthKeys } from '../SynthKeys/SynthKeys';


export const SynthKeysContainer = (props) => {

    const notes = ["C", "Csh", "D", "Dsh", "E", "F", "Fsh", "G", "Gsh", "A", "Ash", "B"];

    const renderKeys = () => {
        const numOctaves = Number(props.numOctaves);
        let lowOctave = Number(props.lowOctave);
        let octaveIndex = lowOctave;
        let contents = [];

        for (let o = 0; o < numOctaves; o++) {
            let octave = [];
            for (let i = 0; i < notes.length; i++) {
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