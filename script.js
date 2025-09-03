const historicalFigures = [
    {
        name: "Hypatia of Alexandria",
        alternativeNames: ["Hypatia", "Hypathia"],
        clue: "A voice of reason in the Library's twilight, silenced by zeal.",
        imageUrl: "images/hypatia.jpg"
    },
    {
        name: "Sitting Bull",
        alternativeNames: ["Sitting Bull", "Tatanka Iyotanka"],
        clue: "A vision of horses and a stand at Little Bighorn.",
        imageUrl: "images/sittingbull.jpg"
    },
    {
        name: "Imhotep",
        alternativeNames: ["Imhotep", "Imouthes"],
        clue: "Stone stacked for eternity by a healer of kings.",
        imageUrl: "images/imhotep.jpg"
    },
    {
        name: "Florence Nightingale",
        alternativeNames: ["Florence Nightingale", "Lady with the Lamp"],
        clue: "A shadow with a lamp in a Crimean night.",
        imageUrl: "images/florencenightingale.avif"
    },
    {
        name: "Toussaint Louverture",
        alternativeNames: ["Toussaint Louverture", "Toussaint L'Ouverture", "François-Dominique Toussaint Louverture"],
        clue: "A Black Jacobin whose revolution burned brighter than Napoleon's star.",
        imageUrl: "images/Toussaint_Louverture.jpg"
    }
];

class FaceGuessrGame {
    constructor() {
        this.currentQuestionIndex = 0;
        this.totalQuestions = 5;
        this.score = 0;
        this.answers = [];
        this.dailyFigures = [];
        this.gameCompleted = false;
        this.awaitingSuggestionResponse = false;
        this.currentSuggestion = null;
        this.reviewMode = false;
        this.currentReviewIndex = 0;
        this.inGameReviewMode = false;
        this.initializeElements();
        this.setupEventListeners();
        this.loadTodaysGame();
        this.checkFirstVisit();
    }

    initializeElements() {
        this.personImage = document.getElementById('person-image');
        this.crypticClue = document.getElementById('cryptic-clue');
        this.guessInput = document.getElementById('guess-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.previousQuestionBtn = document.getElementById('previous-question-btn');
        this.feedbackMessage = document.getElementById('feedback-message');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.progressFill = document.getElementById('progress-fill');
        this.currentScoreSpan = document.getElementById('current-score');
        this.resultsScreen = document.getElementById('results-screen');
        this.finalScore = document.getElementById('final-score');
        this.scoreDetails = document.getElementById('score-details');
        this.shareBtn = document.getElementById('share-btn');
        this.shareText = document.getElementById('share-text');
        this.shareTextarea = document.getElementById('share-textarea');
        this.copyBtn = document.getElementById('copy-btn');
        this.countdown = document.getElementById('countdown');
        this.suggestionDialog = document.getElementById('suggestion-dialog');
        this.suggestedAnswer = document.getElementById('suggested-answer');
        this.yesBtn = document.getElementById('yes-btn');
        this.noBtn = document.getElementById('no-btn');
        this.closeResultsBtn = document.getElementById('close-results');
        this.reviewNav = document.getElementById('review-nav');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtnReview = document.getElementById('next-btn-review');
        this.reviewQuestion = document.getElementById('review-question');
        this.showResultsBtn = document.getElementById('show-results-btn');
        this.howToPlayModal = document.getElementById('how-to-play-modal');
        this.closeHowToPlayBtn = document.getElementById('close-how-to-play');
        this.rulesBtn = document.getElementById('rules-btn');
    }

    setupEventListeners() {
        this.submitBtn.addEventListener('click', () => this.handleGuess());
        this.nextBtn.addEventListener('click', () => {
            if (this.reviewMode) {
                this.nextAnswer();
            } else {
                this.nextQuestion();
            }
        });
        this.previousQuestionBtn.addEventListener('click', () => {
            if (this.reviewMode) {
                this.previousAnswer();
            } else {
                this.previousQuestion();
            }
        });
        this.shareBtn.addEventListener('click', () => this.showShareText());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.yesBtn.addEventListener('click', () => this.acceptSuggestion());
        this.noBtn.addEventListener('click', () => this.rejectSuggestion());
        this.closeResultsBtn.addEventListener('click', () => this.closeResults());
        this.prevBtn.addEventListener('click', () => this.previousAnswer());
        this.nextBtnReview.addEventListener('click', () => this.nextAnswer());
        this.showResultsBtn.addEventListener('click', () => this.showResults());
        this.closeHowToPlayBtn.addEventListener('click', () => this.closeHowToPlay());
        this.rulesBtn.addEventListener('click', () => this.showHowToPlay());
        
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.awaitingSuggestionResponse) {
                    return;
                } else if (!this.submitBtn.disabled && this.submitBtn.style.display !== 'none') {
                    this.handleGuess();
                } else if (!this.nextBtn.classList.contains('hidden')) {
                    this.nextQuestion();
                }
            }
        });
        
        this.guessInput.addEventListener('input', () => {
            this.submitBtn.disabled = this.guessInput.value.trim().length === 0;
        });

        this.startCountdown();
    }

    getTodayGMT() {
        const now = new Date();
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();
        return new Date(utcYear, utcMonth, utcDate);
    }

    getDaysSinceEpoch() {
        const epoch = new Date('2024-01-01');
        const today = this.getTodayGMT();
        const diffTime = today.getTime() - epoch.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    loadTodaysGame() {
        const gameKey = this.getTodayGMT().toISOString().split('T')[0];
        const savedGame = localStorage.getItem(`faceguessr_game_${gameKey}`);
        
        if (savedGame) {
            const gameData = JSON.parse(savedGame);
            this.score = gameData.score;
            this.answers = gameData.answers;
            this.currentQuestionIndex = gameData.currentQuestionIndex;
            this.dailyFigures = gameData.dailyFigures;
            
            if (this.currentQuestionIndex >= this.totalQuestions) {
                this.showResults();
                return;
            }
        } else {
            this.generateDailyFigures();
        }
        
        this.updateUI();
        this.displayCurrentQuestion();
    }

    generateDailyFigures() {
        // Always use the same 5 figures in the same order
        this.dailyFigures = [...historicalFigures];
    }

    updateUI() {
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsSpan.textContent = this.totalQuestions;
        this.currentScoreSpan.textContent = this.score;
        
        const progress = ((this.currentQuestionIndex) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Show Previous button if we have answered at least one question or in review mode
        if ((this.answers.length > 0 && !this.inGameReviewMode) || 
            (this.inGameReviewMode && this.currentQuestionIndex > 0)) {
            this.previousQuestionBtn.classList.remove('hidden');
        } else {
            this.previousQuestionBtn.classList.add('hidden');
        }
    }

    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }

        const currentFigure = this.dailyFigures[this.currentQuestionIndex];
        this.personImage.src = currentFigure.imageUrl;
        this.personImage.alt = `Historical figure ${this.currentQuestionIndex + 1}`;
        this.crypticClue.textContent = currentFigure.clue;
        
        // Reset input state
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.submitBtn.disabled = true;
        this.submitBtn.style.display = 'block';
        this.nextBtn.classList.add('hidden');
        this.feedbackMessage.textContent = '';
        this.feedbackMessage.className = '';
        this.suggestionDialog.classList.add('hidden');
        this.awaitingSuggestionResponse = false;
        this.currentSuggestion = null;
    }

    // Levenshtein distance algorithm for fuzzy matching
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    findClosestMatch(guess, figure) {
        const normalizedGuess = guess.toLowerCase().trim();
        const allNames = [figure.name, ...figure.alternativeNames];
        let bestMatch = null;
        let bestDistance = Infinity;
        let bestSimilarity = 0;
        
        allNames.forEach(name => {
            const normalizedName = name.toLowerCase();
            const distance = this.levenshteinDistance(normalizedGuess, normalizedName);
            const similarity = 1 - (distance / Math.max(normalizedGuess.length, normalizedName.length));
            
            // Consider it a close match if similarity > 70% and distance <= 3
            if (similarity > 0.7 && distance <= 3 && similarity > bestSimilarity) {
                bestMatch = name;
                bestDistance = distance;
                bestSimilarity = similarity;
            }
        });
        
        return bestMatch;
    }

    handleGuess() {
        if (this.awaitingSuggestionResponse) return;
        
        const guess = this.guessInput.value.trim();
        if (!guess) return;

        const currentFigure = this.dailyFigures[this.currentQuestionIndex];
        const isCorrect = this.checkGuess(guess, currentFigure);
        
        if (isCorrect) {
            this.processCorrectAnswer(guess, currentFigure);
        } else {
            // Check for close matches
            const closestMatch = this.findClosestMatch(guess, currentFigure);
            
            if (closestMatch) {
                this.showSuggestion(closestMatch, guess, currentFigure);
            } else {
                this.processIncorrectAnswer(guess, currentFigure);
            }
        }
    }

    processCorrectAnswer(guess, figure) {
        this.answers.push({
            question: this.currentQuestionIndex + 1,
            guess: guess,
            correct: true,
            answer: figure.name
        });
        
        this.score++;
        this.currentScoreSpan.textContent = this.score;
        
        this.showFeedback(true, figure.name);
        this.saveGame();
    }

    processIncorrectAnswer(guess, figure) {
        this.answers.push({
            question: this.currentQuestionIndex + 1,
            guess: guess,
            correct: false,
            answer: figure.name
        });
        
        this.showFeedback(false, figure.name);
        this.saveGame();
    }

    showSuggestion(suggestion, originalGuess, figure) {
        this.awaitingSuggestionResponse = true;
        this.currentSuggestion = {
            suggestion: suggestion,
            originalGuess: originalGuess,
            figure: figure
        };
        
        this.suggestedAnswer.textContent = suggestion;
        this.suggestionDialog.classList.remove('hidden');
        
        // Prevent body scrolling while dialog is open
        document.body.style.overflow = 'hidden';
        
        // Disable input while waiting for response
        this.guessInput.disabled = true;
        this.submitBtn.disabled = true;
    }

    acceptSuggestion() {
        this.suggestionDialog.classList.add('hidden');
        this.awaitingSuggestionResponse = false;
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Process as correct answer with the suggested name
        this.processCorrectAnswer(this.currentSuggestion.suggestion, this.currentSuggestion.figure);
        
        this.currentSuggestion = null;
    }

    rejectSuggestion() {
        this.suggestionDialog.classList.add('hidden');
        this.awaitingSuggestionResponse = false;
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Process as incorrect answer with original guess
        this.processIncorrectAnswer(this.currentSuggestion.originalGuess, this.currentSuggestion.figure);
        
        this.currentSuggestion = null;
    }

    checkGuess(guess, figure) {
        const normalizedGuess = guess.toLowerCase().trim();
        const normalizedName = figure.name.toLowerCase();
        
        if (normalizedGuess === normalizedName) {
            return true;
        }
        
        return figure.alternativeNames.some(altName => 
            altName.toLowerCase() === normalizedGuess
        );
    }

    showFeedback(isCorrect, correctName) {
        this.feedbackMessage.className = '';
        
        if (isCorrect) {
            this.feedbackMessage.textContent = "✅ Correct! Well done!";
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Wrong! The correct answer is ${correctName}.`;
            this.feedbackMessage.classList.add('incorrect');
        }
        
        // Trigger shake animation
        this.feedbackMessage.classList.add('shake');
        
        // Remove shake class after animation completes to allow re-triggering
        setTimeout(() => {
            this.feedbackMessage.classList.remove('shake');
        }, 600);

        // Disable input
        this.guessInput.disabled = true;
        this.submitBtn.style.display = 'none';
        
        // Check if this was the final question
        if (this.currentQuestionIndex + 1 >= this.totalQuestions) {
            // Auto-show results after a brief delay for final question
            setTimeout(() => {
                this.showResults();
            }, 2000);
        } else {
            // Show next button for non-final questions
            this.nextBtn.classList.remove('hidden');
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.updateUI();
        
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.showResults();
        } else {
            this.displayCurrentQuestion();
        }
        
        this.saveGame();
    }

    previousQuestion() {
        // Only allow going back if we have answers to review
        if (this.answers.length === 0) return;
        
        // Enter in-game review mode
        this.inGameReviewMode = true;
        
        // If we're currently on a new question, go back to the last answered one
        if (this.currentQuestionIndex >= this.answers.length) {
            this.currentQuestionIndex = this.answers.length - 1;
        } else if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
        
        this.displayPreviousAnswer();
        this.updateUI();
    }

    displayPreviousAnswer() {
        const answer = this.answers[this.currentQuestionIndex];
        const figure = this.dailyFigures[this.currentQuestionIndex];
        
        // Display the question
        this.personImage.src = figure.imageUrl;
        this.personImage.alt = `${figure.name} - Question ${this.currentQuestionIndex + 1}`;
        this.crypticClue.textContent = figure.clue;
        
        // Show what was guessed and the result
        this.guessInput.value = answer.guess;
        this.guessInput.disabled = true;
        
        // Hide submit button, show appropriate navigation
        this.submitBtn.style.display = 'none';
        
        // Show feedback
        this.feedbackMessage.className = '';
        if (answer.correct) {
            this.feedbackMessage.textContent = `✅ Your guess: "${answer.guess}" - Correct!`;
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Your guess: "${answer.guess}" - Wrong! Answer: ${answer.answer}`;
            this.feedbackMessage.classList.add('incorrect');
        }
        
        // Show next button to continue forward or return to current question
        this.nextBtn.classList.remove('hidden');
        this.nextBtn.textContent = this.currentQuestionIndex === this.answers.length - 1 ? 'Continue Game' : 'Next Answer';
    }

    nextQuestion() {
        if (this.inGameReviewMode) {
            // If we're at the last answered question, return to the current game state
            if (this.currentQuestionIndex === this.answers.length - 1) {
                this.inGameReviewMode = false;
                this.currentQuestionIndex = this.answers.length;
                this.displayCurrentQuestion();
                this.nextBtn.textContent = 'Next Question';
            } else {
                // Move to next reviewed answer
                this.currentQuestionIndex++;
                this.displayPreviousAnswer();
            }
        } else {
            // Normal next question logic
            this.currentQuestionIndex++;
        }
        
        this.updateUI();
        
        if (!this.inGameReviewMode && this.currentQuestionIndex >= this.totalQuestions) {
            this.showResults();
        } else if (!this.inGameReviewMode) {
            this.displayCurrentQuestion();
        }
        
        this.saveGame();
    }

    updateProgress() {
        const progress = 100;
        this.progressFill.style.width = `${progress}%`;
    }

    showShareText() {
        const today = this.getTodayGMT().toLocaleDateString();
        const dayNumber = this.getDaysSinceEpoch() + 1;
        
        let shareString = `FaceGuessr ${dayNumber} ${this.score}/5\n\n`;
        
        this.answers.forEach((answer) => {
            shareString += answer.correct ? '🟩 ' : '🟥 ';
        });
        
        shareString += `\n\nGuess 5 historical figures daily!\nhttps://saleswrite.github.io/Faceguessr/`;
        
        this.shareTextarea.value = shareString;
        this.shareText.classList.remove('hidden');
    }

    copyToClipboard() {
        this.shareTextarea.select();
        this.shareTextarea.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(this.shareTextarea.value).then(() => {
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        }).catch(() => {
            document.execCommand('copy');
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        });
    }

    startCountdown() {
        const updateCountdown = () => {
            const now = new Date();
            const currentUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
                                       now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            
            // Calculate next midnight GMT
            const nextMidnightUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0);
            
            const diff = nextMidnightUTC - currentUTC;
            
            if (diff <= 0) {
                location.reload();
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            this.countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    saveGame() {
        const gameKey = this.getTodayGMT().toISOString().split('T')[0];
        const gameData = {
            score: this.score,
            answers: this.answers,
            currentQuestionIndex: this.currentQuestionIndex,
            dailyFigures: this.dailyFigures
        };
        localStorage.setItem(`faceguessr_game_${gameKey}`, JSON.stringify(gameData));
    }

    closeResults() {
        this.resultsScreen.classList.add('hidden');
        this.reviewMode = true;
        this.currentReviewIndex = 0;
        this.showReviewMode();
    }

    showReviewMode() {
        // Keep original game layout but modify it for review mode
        document.querySelector('.progress-container').style.display = 'block';
        document.querySelector('.guess-container').style.display = 'flex';
        document.querySelector('.feedback-container').style.display = 'flex';
        
        // Hide the review navigation (use original layout)
        this.reviewNav.classList.add('hidden');
        
        // Display the current answer being reviewed using original layout
        this.displayReviewAnswer();
    }

    displayReviewAnswer() {
        const reviewAnswer = this.answers[this.currentReviewIndex];
        const reviewFigure = this.dailyFigures[this.currentReviewIndex];
        
        // Update the image and clue using original layout
        this.personImage.src = reviewFigure.imageUrl;
        this.personImage.alt = `${reviewFigure.name} - Question ${this.currentReviewIndex + 1}`;
        this.crypticClue.textContent = reviewFigure.clue;
        
        // Update progress bar to show review position
        this.currentQuestionSpan.textContent = this.currentReviewIndex + 1;
        const progress = ((this.currentReviewIndex + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Show the user's guess in the input field
        this.guessInput.value = reviewAnswer.guess;
        this.guessInput.disabled = true;
        
        // Hide submit button, show navigation using original buttons
        this.submitBtn.style.display = 'none';
        this.previousQuestionBtn.classList.remove('hidden');
        this.nextBtn.classList.remove('hidden');
        
        // Update button text and states
        this.previousQuestionBtn.textContent = 'Previous';
        this.previousQuestionBtn.disabled = this.currentReviewIndex === 0;
        this.nextBtn.textContent = this.currentReviewIndex === this.answers.length - 1 ? 'View Results' : 'Next';
        this.nextBtn.disabled = false;
        
        // Show what the user guessed and if it was correct
        this.feedbackMessage.className = '';
        if (reviewAnswer.correct) {
            this.feedbackMessage.textContent = `✅ Your guess: "${reviewAnswer.guess}" - Correct!`;
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Your guess: "${reviewAnswer.guess}" - Wrong! Answer: ${reviewAnswer.answer}`;
            this.feedbackMessage.classList.add('incorrect');
        }
    }

    previousAnswer() {
        if (this.currentReviewIndex > 0) {
            this.currentReviewIndex--;
            this.displayReviewAnswer();
        }
    }

    nextAnswer() {
        if (this.currentReviewIndex < this.answers.length - 1) {
            this.currentReviewIndex++;
            this.displayReviewAnswer();
        } else {
            // If at the last answer, return to results
            this.showResults();
        }
    }

    showResults() {
        if (this.reviewMode) {
            // Hide review mode and restore original layout
            this.reviewNav.classList.add('hidden');
            document.querySelector('.progress-container').style.display = 'block';
            document.querySelector('.feedback-container').style.display = 'flex';
            this.feedbackMessage.textContent = '';
            this.feedbackMessage.className = '';
        }
        
        this.resultsScreen.classList.remove('hidden');
        this.finalScore.textContent = `${this.score}`;
        
        // Show score breakdown
        this.scoreDetails.innerHTML = '';
        this.answers.forEach((answer, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = `result-item ${answer.correct ? 'correct' : 'incorrect'}`;
            resultDiv.innerHTML = `
                <div class="result-info">
                    <span class="question-num">${answer.question}.</span>
                    <span class="result-icon">${answer.correct ? '✓' : '✗'}</span>
                    <span class="answer-text">${answer.answer}</span>
                </div>
                <div class="result-progress-bar">
                    <div class="result-progress-fill ${answer.correct ? 'correct-fill' : 'incorrect-fill'}"></div>
                </div>
            `;
            this.scoreDetails.appendChild(resultDiv);
        });

        this.updateProgress();
        this.saveGame();
    }

    showHowToPlay() {
        this.howToPlayModal.classList.remove('hidden');
    }

    closeHowToPlay() {
        this.howToPlayModal.classList.add('hidden');
    }

    checkFirstVisit() {
        const hasVisited = localStorage.getItem('faceguessr_has_visited');
        if (!hasVisited) {
            // Show the How to Play modal for first-time visitors
            this.showHowToPlay();
            localStorage.setItem('faceguessr_has_visited', 'true');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FaceGuessrGame();
});