import { UIManager } from "./uiManager.js";
import { Game } from "./gameLogic.js";

document.addEventListener("DOMContentLoaded", () => {
    const guestMessage = document.getElementById("guest-message");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        // message to inform user if not logged in
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
        setTimeout(() => guestMessage.style.display = "none", 5000);
    }

    const difficultyButtons = document.querySelectorAll(".difficulty-btn");
    const ui = new UIManager();

    difficultyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const difficulty = btn.dataset.difficulty;
            document.getElementById("difficulty-selection").style.display = "none";
            document.getElementById("game-ui").style.display ="block";

            const game = new Game(difficulty, ui);

            ui.createButtons(ui.chordSelection, game.availableChords, "chord", (value, type) => game.handleSelection(value, type));

            if (game.enableNoteGuess)
                ui.createButtons(ui.noteSelection, game.allNotes, "note", (value, type) => game.handleSelection(value, type));

            ui.playBtn.addEventListener("click", () => game.playRandomChord());
        });  

    });
});