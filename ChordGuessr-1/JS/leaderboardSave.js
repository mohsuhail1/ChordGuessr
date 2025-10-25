export function saveScore(difficulty, username, score) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {
        easy: {},
        medium: {},
        advanced: {}
    };

    if (!leaderboard[difficulty][username] || score > leaderboard[difficulty][username]) {
        leaderboard[difficulty][username] = score;
    }

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}