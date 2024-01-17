//Query Selectors
var highscoresOL = document.querySelector("#highscores")
var clearButton = document.querySelector("#clear")
var feedbackDiv = document.querySelector("#feedback")

//Function to retive high scores from local storage
function getHighScores() {
    var highScores = JSON.parse(localStorage.getItem("scores"))
    return highScores
}

function renderHighscores(highScores) {
    highscoresOL.innerHTML = ""
    if (highScores.length < 1) {
        var highScoreH3 = document.createElement("h3")
        highScoreH3.textContent = `There are no highsores yet`
        highscoresOL.appendChild(highScoreH3)
        return
    }
    highScores.sort((a, b) => b.score - a.score)
    highScores.forEach((score) => {
        var highScoreLI = document.createElement("li")
        highScoreLI.textContent = `${score.initials} - ${score.score}`
        highscoresOL.appendChild(highScoreLI)
    });
}

function clearHighScores() {
    if (getHighScores() < 1) {
        renderFeedback("There are currently no high scores", "red", 3000)
        return
    }
    localStorage.setItem("scores", "[]")
    renderHighscores(getHighScores())
    renderFeedback("All high scores have been reset", "green", 3000)
}

function renderFeedback(message, color, duration) {
    feedbackDiv.classList.remove("hide")
    feedbackDiv.textContent = message
    feedbackDiv.style.color = color

    setTimeout(() => {
        feedbackDiv.classList.add("hide")
    }, duration)
}

renderHighscores(getHighScores())

//Event listeners
clearButton.addEventListener("click", clearHighScores)