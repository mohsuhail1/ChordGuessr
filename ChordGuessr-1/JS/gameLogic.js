import { audioPlayer } from "./audio.js"
import { saveScore } from "./leaderboardSave.js"

export class Game {
    constructor(difficulty, ui) {
        this.difficulty = difficulty;
        this.ui = ui;
        this.audio = new audioPlayer();
        this.streak = 0;
        this.currentChord = {};
        this.enableNoteGuess = difficulty === "advanced";

        this.allNotes = ["C","D", "E", "F", "G", "A", "B"];
        this.easyChords = ["Major", "Minor"];
        this.mediumChords = ["Major", "Minor", "Diminished"];
        this.availableChords =  this.getAvailableChords();

        this.selectedNote = null;
        this.selectedChord = null;
    }

    getAvailableChords() {
        if (this.difficulty === "easy") return this.easyChords;
        if (this.difficulty === "medium") return this.mediumChords;
        return this.mediumChords; // since advanced uses the same chords as medium
    }

    playRandomChord() {
        const randomNote = this.allNotes[Math.floor(Math.random() * this.allNotes.length)];
        const randomChord = this.availableChords[Math.floor(Math.random() * this.availableChords.length)];
        this.currentChord = { note: randomNote, chord: randomChord };
        this.audio.playChord(randomNote, randomChord);
        this.ui.updateStatus("A chord has been played.");
    }

    handleSelection(value, type) {
        if (type === "note") this.selectedNote = value;
        else this.selectedChord = value;

        if (!this.enableNoteGuess && this.selectedChord) {
            this.checkAnswer(null, this.selectedChord);
            this.selectedChord = null;
        }

        if (this.enableNoteGuess && this.selectedNote && this.selectedChord) {
            this.checkAnswer(this.selectedNote, this.selectedChord);
            this.selectedNote = null;
            this.selectedChord = null;
        }
    }

    checkAnswer(note, chord) {
        const correct = 
            (!this.enableNoteGuess && chord === this.currentChord.chord) ||
            (this.enableNoteGuess && note === this.currentChord.note && chord === this.currentChord.chord);
        
        if (correct) {
            this.streak++;
            this.ui.updateStatus(`Correct! It was ${this.currentChord.note} ${this.currentChord.chord}`);
            this.ui.updateStreak(this.streak);
        } else {
            const finalStreak = this.streak; // storing user's final streak before they save/try again
            this.ui.updateStatus(`Wrong! It was ${this.currentChord.note} ${this.currentChord.chord}`);
            this.ui.updateStreak(this.streak);
            this.ui.showEndStreak(this.streak, (retry,save) => {
                const user = localStorage.getItem("loggedInUser");
                if (save && user) saveScore(this.difficulty, user, finalStreak);
                this.reset();
                retry();
            });
        }
    }

    reset () {
        this.streak = 0;
        this.ui.updateStreak(0);
    }
}