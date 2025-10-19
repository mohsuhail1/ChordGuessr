document.addEventListener("DOMContentLoaded", () =>{
    let difficulty = prompt("Select difficulty: Easy, Medium or Advanced").toLowerCase();

    const chordSelection = document.getElementById("chord-selection");
    const noteSelection = document.getElementById("note-selection");
    const status = document.getElementById("status");
    const playBtn = document.getElementById("play-btn");
    const streakDisplay = document.getElementById("streak");

    const allNotes = ["C", "D", "E", "F", "G", "A", "B"];
    const easyChords = ["Major", "Minor"];
    const mediumChords = ["Major", "Minor", "Diminished"];
    const advancedChords = mediumChords; // same three chords from medium, but there will be root note guessing

    // initializing web audio API to generate and play sounds
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playNote(frequency, duration = 1) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        oscillator.start();
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // volume
        oscillator.stop(audioCtx.currentTime + duration);
    }

    function playChord(root, type) {
        const rootFreq = noteFrequencies[root];
        if (!rootFreq) return;

        let chordIntervals;

        if (type === "Major") chordIntervals = [0,4,7];
        else if (type === "Minor") chordIntervals = [0,3,7];
        else if (type === "Diminished") chordIntervals = [0,3,6];
        else return;

        const duration = 1.5;
        chordIntervals.forEach(interval => {
            const freq = rootFreq * Math.pow(2, interval / 12);
            playNote(freq, duration);
        });
    }

    let currentChord = {};
    let streak = 0;

    let availableChords;
    let enableNoteGuess = false;

    if (difficulty == "easy") {
        availableChords = easyChords;
    } else if (difficulty == "medium") {
        availableChords = mediumChords;
    } else {
        availableChords = advancedChords;
        enableNoteGuess = true;
    }

    // Creating chord buttons, 
    createButtons(chordSelection, availableChords, "chord");

    // showing root note buttons for advanced difficulty
    if (enableNoteGuess) {
        createButtons(noteSelection, allNotes, "note");
    }

    // creating the function that is being called in lines 31 and 35
    function createButtons(container, items, type) {
        items.forEach(item => {
            const btn = document.createElement("button");
            btn.textContent = item;
            btn.addEventListener("click",() => handleSelection(item, type));
            container.appendChild(btn);
        });
    }
    
    const noteFrequencies = {
        "C": 261.63,
        "D": 293.66,
        "E": 329.63,
        "F": 349.23,
        "G": 392.00,
        "A": 440.00,
        "B": 493.88
    };

    // generating random chord
    playBtn.addEventListener("click", () => {
        const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
        const randomChord = availableChords[Math.floor(Math.random() * availableChords.length)];
        currentChord = { note: randomNote, chord: randomChord };
        playChord(randomNote, randomChord); // playing audio of the chord
        status.textContent = "A chord has been played";
    });

    // handling user guesses

    let selectedNote = null;
    let selectedChord = null;

    function handleSelection(value, type) {
        if (type === "note") selectedNote = value;
        else selectedChord = value;

        // Easy/Medium: only chord guess
        if (!enableNoteGuess && selectedChord) {
            checkAnswer(null, selectedChord);
            selectedChord = null;
        }

        // advanced: both chord and root note to be guessed
        if (enableNoteGuess && selectedNote && selectedChord) {
            checkAnswer(selectedNote, selectedChord);
            selectedNote = null;
            selectedChord = null;
        }
    }
    // creating the function to check answers, which is being called in lines 67 and 73.
    function checkAnswer(note, chord) {
        const correct = 
            (!enableNoteGuess && chord === currentChord.chord) ||
            (enableNoteGuess && note === currentChord.note && chord === currentChord.chord);
        
        if (correct) {
            streak++;
            status.textContent = `Correct! Streak : ${streak}`;
        } else {
            streak = 0;
            status.textContent = `Wrong! It was ${currentChord.note} ${currentChord.chord}`;
        }

        streakDisplay.textContent = `Streak: ${streak}`;
    }
})