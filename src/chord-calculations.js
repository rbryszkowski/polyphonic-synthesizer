
const notes = ["C", "Csh", "D", "Dsh", "E", "F", "Fsh", "G", "Gsh", "A", "Ash", "B"];

const scales = {
  major: {
    intervals: [2,2,1,2,2,2,1],
    chords: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished']
  },
  minor: {
    intervals: [2,1,2,2,1,2,2],
    chords: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major']
  }
}

const chordTypes = {
  //maj3rd = 4 semitones, min3rd = 3 semitones
  'major': { intervalsInSemitones: [4,3] },

  'minor': { intervalsInSemitones: [3,4] },

  'diminished': { intervalsInSemitones: [3,3] },

  'augmented': { intervalsInSemitones: [4,4] },

  'M7': { intervalsInSemitones: [4,3,4] },

  'm7': { intervalsInSemitones: [3,4,3] },

  'dom7': { intervalsInSemitones: [4,3,3] },

  'M7b5': { intervalsInSemitones: [4,2,5] },

  'm7b5': { intervalsInSemitones: [3,3,4] },

  '7b5': { intervalsInSemitones: [4,2,4] },

  '7#5': { intervalsInSemitones: [4,4,2] },

}

export const ChordCalculations = {

  formatNote(note) {
    return note.replace('sh', '#');
  },

  getNotes() {
    return notes;
  },

  getScaleTones(root, type) {
    let scaleTones = [];
    let j=0;
    let interval;
    for (let i=0;i<notes.length;i+=interval) {
      scaleTones.push(notes[i]);
      interval = scales[type].intervals[j];
      j++;
    }
    return scaleTones;
  },

  getChordsInKey(scaleRoot, scaleType) {
    let scaleTones = this.getScaleTones(scaleRoot, scaleType);
    let chordArr = [];
    for (let i=0;i<scaleTones.length;i++) {
      let chordRoot = scaleTones[i];
      let chordType = scales[scaleType].chords[i];
      chordArr.push(`${chordRoot} ${chordType}`);
    }
    return chordArr;
  },

  getChordFromScalePosition(position, scaleRoot, scaleType) {
    return this.getChordsInKey(scaleRoot, scaleType)[position - 1];
  },

  getChordNumeral(chordNumber, scaleType) {
    const minorNumerals = ['i', 'ii°', 'bIII', 'iv', 'v', 'bVI', 'bVII'];
    const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'VII°'];
    let chordNumeral;
    switch (scaleType) {
      case 'major':
      chordNumeral = majorNumerals[chordNumber - 1];
      break;
      case 'minor':
      chordNumeral = minorNumerals[chordNumber - 1];
      break;
      default:
      console.log(scaleType, 'is not a valid scale type');
    }
    return chordNumeral;
  },

  buildChord(chordRoot, scaleRoot, scaleType, chordSize) {
    let scaleTones = this.getScaleTones(scaleRoot, scaleType);
    //console.log('scale tones:', scaleTones);
    if( !scaleTones.includes(chordRoot) ) { return; }
    let chord = [];
    let scaleToneIndex = scaleTones.indexOf(chordRoot);
    for (let i=0;i<chordSize;i++) {
      chord.push(scaleTones[scaleToneIndex]);
      scaleToneIndex = (scaleToneIndex + 2) % scaleTones.length;
      //console.log('scale tone index:', scaleToneIndex);
    }
    //console.log('chord:', chord);
    return chord;
  },


  buildChordFromType(root, type) {

    if (!chordTypes[type]) {
      console.log(type + ' is not a valid chord type!');
      return;
    }

    if (!notes.includes(root)) {
      console.log(root + ' is not a valid chord root!');
      return;
    }

    let chordArr = [];
    const intervalArr = chordTypes[type].intervalsInSemitones;
    const chordLength = intervalArr.length + 1;
    let index = notes.indexOf(root);

    for (let i=0;i<chordLength;i++) {
      chordArr.push(notes[index]);
      index = (index + intervalArr[i]) % notes.length;
    }

    return chordArr;

  },

  notesInRange(startPitch, endPitch) {
    let notesInRange = []
    let startNote = startPitch.replace('#','sh').slice(0,-1);
    let startOctave = startPitch.slice(-1);
    let i = notes.indexOf(startNote);
    let octave = startOctave;
    let pitch;
    while (pitch!==endPitch) {
      pitch = notes[i%notes.length] + octave;
      notesInRange.push(pitch);
      i++;
      if (i%notes.length===0) {octave++};
    }
    return notesInRange;
  },

  addOctaves(lowestOctave, arr) { //works for chords and scales and note sets that dont skip octaves
    let indexedNotes = [];
    let octave = lowestOctave;
    for (let i=0;i<arr.length;i++) {
      if (i !== 0 && notes.indexOf(arr[i]) <= notes.indexOf(arr[i-1])) {
        octave++;
      }
      indexedNotes.push(arr[i] + octave);
    }
    return indexedNotes;
  }

}

//TEST:
ChordCalculations.buildChordFromType('C', 'M7b5');
