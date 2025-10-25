export class UIManager {
    constructor() {
        this.status = document.getElementById("status");
        this.streakDisplay = document.getElementById("streak");
        this.playBtn = document.getElementById("play-btn");
        this.chordSelection = document.getElementById("chord-selection");
        this.noteSelection = document.getElementById("note-selection");
        this.endStreakDiv = document.getElementById("end-streak");
        this.endStreakMessage = document.getElementById("end-streak-message");
        this.retryBtn = document.getElementById("retryBtn");
        this.saveScoreBtn = document.getElementById("saveScoreBtn");
    }

    updateStatus(text) {
        this.status.textContent = text;
    }

    updateStreak(streak) {
        this.streakDisplay.textContent = `Streak ${streak}`;
    }

    createButtons(container, items, type, callback) {
        container.innerHTML = "";
        items.forEach(item => {
            const btn = document.createElement("button");
            btn.textContent = item;
            btn.addEventListener("click", () => callback(item, type));
            container.appendChild(btn);
        });
    }

    showEndStreak(streak, onAction) {
        this.endStreakMessage.textContent = `Your streak ended at ${streak}`;
        const loggedInUser = localStorage.getItem("loggedInUser");

        if (!loggedInUser) {
            this.saveScoreBtn.disabled = true;
            this.saveScoreBtn.textContent = "Log in to save your score";
        } else {
            this.saveScoreBtn.disabled = false;
            this.saveScoreBtn.textContent = "Save score";
        }

        this.endStreakDiv.style.display = "block";

        this.retryBtn.onclick = () => {
            this.endStreakDiv.style.display = "none";
            onAction(() => {}, false);
        };
        this.saveScoreBtn.onclick = () => {
            onAction(() => {}, true);
        };
    }
}