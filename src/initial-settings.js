
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

export const InitSettings {


}
