
import * as Tone from 'tone'; //generate sounds

export const Synths = {

    amSynth() {
        return new Tone.PolySynth(Tone.AMSynth);
    },

    fmSynth() {
        return new Tone.PolySynth(Tone.FMSynth);
    },

    duoSynth() {
        return new Tone.PolySynth(Tone.DuoSynth);
    },

    membraneSynth() {
        return new Tone.PolySynth(Tone.MembraneSynth);
    },

    metalSynth() {
        return new Tone.PolySynth(Tone.MetalSynth);
    },

    noiseSynth() {
        return new Tone.PolySynth(Tone.NoiseSynth);
    },

    pluckSynth() {
        return new Tone.PolySynth(Tone.PluckSynth);
    }

}