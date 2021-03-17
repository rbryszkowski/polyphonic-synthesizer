
import * as Tone from 'tone'; //generate sounds

export const Instruments = {

    amSynth() {
        const synth = new Tone.PolySynth(Tone.AMSynth);
        return synth;
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