document.addEventListener("DOMContentLoaded", () => {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {
        easy: {},
        medium: {},
        advanced: {}
    };

    function displayLeaderboard(difficulty, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        // converting object to array and sort scores by descending
        const sorted = Object.entries(leaderboard[difficulty]).sort((a,b) => b[1] - a[1]);

        if (sorted.length === 0) {
            container.innerHTML = "<li>No scores yet.</li>";
            return;
        }

        sorted.forEach(([username, score]) => {
            const li = document.createElement("li");
            li.textContent = `${username}: ${score}`;
            container.appendChild(li);
        });
    }

    displayLeaderboard("easy", "easy-leaderboard");
    displayLeaderboard("medium", "medium-leaderboard");
    displayLeaderboard("advanced", "advanced-leaderboard");
});