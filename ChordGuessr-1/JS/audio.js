export class audioPlayer {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playNote(frequency, duration = 1) {
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.connect(gainNode); // connects the oscillator to gain node so we can control its volume
        gainNode.connect(this.audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);
    }

    playChord(root, type) {
        const noteFrequencies = {
            // these are frequencies of notes from the fourth octave, roughly the middle of the piano
            "C": 261.63,
            "D": 293.66,
            "E": 329.63,
            "F": 349.23,
            "G": 392.00,
            "A": 440.00,
            "B": 493.88
        };

        const chords = {
            // chord intervals
            Major: [0,4,7],
            Minor: [0,3,7],
            Diminished: [0,3,6]
        };

        const rootFreq = noteFrequencies[root];
        if (!rootFreq) return;

        chords[type]?.forEach(interval => {
            const freq = rootFreq * Math.pow(2, interval /12);
            this.playNote(freq, 1.5);
        });
    }
}