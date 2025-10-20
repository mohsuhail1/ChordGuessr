document.addEventListener("DOMContentLoaded", () =>{

    const loggedInUser = localStorage.getItem("loggedInUser");
    const guestMessage = document.getElementById("guest-message");

    // if no logged in user was found in local storage, the user will be notified that their scores wont be saved to the leaderboard.
    if (!loggedInUser) {
        guestMessage.textContent = "You are currently playing as a guest. Your scores will not be saved to the leaderboard.";
        guestMessage.style.display = "block";
        guestMessage.style.backgroundColor = '#a09696';
        guestMessage.style.color = "#000";
        guestMessage.style.padding = "5px";
        guestMessage.style.borderRadius = "5px";
        guestMessage.style.textAlign = "center";
        guestMessage.style.marginBottom = "10px";
        guestMessage.style.fontWeight = "bold";
        guestMessage.style.display = "inline";

        // hiding message after 5 seconds
        setTimeout(() => guestMessage.style.display = 'none', 5000);
    }


    const difficultyButtons = document.querySelectorAll(".difficulty-btn");

    difficultyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const difficulty = btn.dataset.difficulty;

            // hiding difficulty selection after it is selected
            document.getElementById("difficulty-selection").style.display = "none";
            // then revealing game UI
            document.getElementById("game-ui").style.display = "block";

            initGame(difficulty);
        });
    })


    function initGame(difficulty) {
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

        // creating the function that is being called in lines 104 and 108
        function createButtons(container, items, type) {
            items.forEach(item => {
                const btn = document.createElement("button");
                btn.textContent = item;
                btn.addEventListener("click",() => handleSelection(item, type));
                container.appendChild(btn);
            });
        }
        
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
                status.textContent = `Correct! It was ${currentChord.note} ${currentChord.chord}!`;
                streakDisplay.textContent = `Streak: ${streak}`;
            } else {
                status.textContent = `Wrong! It was ${currentChord.note} ${currentChord.chord}`;
                streakDisplay.textContent = `Streak: ${streak}`;

                // end of streak options, user can either try again or save their score

                const endStreakDiv = document.getElementById("end-streak");
                const endStreakMessage = document.getElementById("end-streak-message");
                const retryBtn = document.getElementById("retryBtn");
                const saveScoreBtn = document.getElementById("saveScoreBtn");

                endStreakMessage.textContent = `Your streak ended at ${streak}`;

                // if the user is not logged in (guest) the save button will be disabled.

                const loggedInUser = localStorage.getItem("loggedInUser");
                if (!loggedInUser) {
                    saveScoreBtn.disabled = true;
                    saveScoreBtn.textContent = "Log in to save your score";
                } else {
                    saveScoreBtn.disabled = false;
                    saveScoreBtn.textContent = "Save score";
                }
                
                // to display after user ends their streak with a wrong guess
                endStreakDiv.style.display = "block";

                // disabling other buttons until user makes their choice
                playBtn.disabled = true;
                chordSelection.querySelectorAll("button").forEach(b => b.disabled = true);
                noteSelection.querySelectorAll("button").forEach(b => b.disabled = true);

                // retry button
                retryBtn.onclick = () => {
                    streak = 0;
                    streakDisplay.textContent = `Streak: ${streak}`;
                    endStreakDiv.style.display = "none";
                    playBtn.disabled = false;
                    chordSelection.querySelectorAll("button").forEach(b => b.disabled = false);
                    noteSelection.querySelectorAll("button").forEach(b => b.disabled = false);
                    status.textContent = "";
                };

                // save score button
                saveScoreBtn.onclick = () => {
                    if (loggedInUser) {
                        saveScore(loggedInUser, streak);
                    }
                    retryBtn.onclick();
                };
                
            }

            function saveScore(username, score) {
                // check difficulty
                const difficulty = enableNoteGuess ? "advanced":
                                    availableChords.length === 2 ? "easy" : "medium";

                // load existing leaderboard or create an empty one
                const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {
                    easy: {},
                    medium: {},
                    advanced: {}
                };

                // update score if it is higher than user's previous score
                const prevScore = leaderboard[difficulty][username] || 0;

                if (score > prevScore) {
                    leaderboard[difficulty][username] = score;
                    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
                    status.textContent = `Score saved! Your best for ${difficulty} is now ${score}.`;
                } else {
                    status.textContent = `Score not higher than your previous best: ${prevScore}.`;
                }
            }
        }
    }    
});