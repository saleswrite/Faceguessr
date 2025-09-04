/**
 * DAILY GAME UI TEMPLATE FRAMEWORK
 * Based on FaceGuessr architecture - Reusable for all daily games
 * 
 * To implement a new game:
 * 1. Extend the DailyGameTemplate class
 * 2. Override abstract methods with your game logic
 * 3. Define your themes data structure
 * 4. Customize the configuration object
 */

// ===== GAME CONFIGURATION TEMPLATE =====
const GAME_CONFIG = {
    // Game Identity
    gameName: "YourGameName", // e.g., "FaceGuessr", "WordChain", etc.
    gameType: "puzzle", // Used in title and descriptions
    totalQuestions: 5,
    
    // Launch Configuration
    launchDate: {
        year: 2025,
        month: 8, // 0-indexed (8 = September)
        day: 3
    },
    
    // Share Configuration
    shareUrl: "https://yourdomain.com/yourgame/",
    shareTagline: "Your game tagline here!",
    
    // UI Text Configuration
    inputPlaceholder: "Enter your answer...",
    submitButtonText: "Submit Answer",
    footerText: "5 questions daily • Resets at midnight GMT",
    
    // Rules Configuration
    rulesIntro: "Brief description of your game mechanics.",
    rules: [
        "Rule 1 description",
        "Rule 2 description", 
        "Rule 3 description",
        "Rule 4 description",
        "Rule 5 description"
    ]
};

// ===== THEMES DATA STRUCTURE TEMPLATE =====
const THEMES_TEMPLATE = {
    1: {
        name: "Theme Name 1",
        items: [
            {
                name: "Answer Name",
                alternativeNames: ["Alternative Name 1", "Alternative Name 2"],
                clue: "Your cryptic clue here",
                contentData: "data.jpg" // or any data your game needs
            }
            // ... more items
        ]
    },
    2: {
        name: "Theme Name 2",
        items: [
            // ... theme 2 items
        ]
    }
    // ... more themes
};

// ===== DAILY GAME TEMPLATE CLASS =====
class DailyGameTemplate {
    constructor(themes, config) {
        this.themes = themes;
        this.config = config;
        
        // Game State
        this.currentQuestionIndex = 0;
        this.totalQuestions = config.totalQuestions || 5;
        this.score = 0;
        this.answers = [];
        this.dailyItems = [];
        this.gameCompleted = false;
        
        // UI State
        this.awaitingSuggestionResponse = false;
        this.currentSuggestion = null;
        this.reviewMode = false;
        this.currentReviewIndex = 0;
        this.inGameReviewMode = false;
        this.currentThemeName = "";
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadTodaysGame();
        this.checkFirstVisit();
    }

    // ===== INITIALIZATION METHODS =====
    initializeElements() {
        // Main game elements
        this.gameContent = document.getElementById('game-content');
        this.gameClue = document.getElementById('game-clue');
        this.gameInput = document.getElementById('game-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.previousQuestionBtn = document.getElementById('previous-question-btn');
        this.feedbackMessage = document.getElementById('feedback-message');
        
        // Progress elements
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.progressFill = document.getElementById('progress-fill');
        this.currentScoreSpan = document.getElementById('current-score');
        
        // Modal elements
        this.resultsScreen = document.getElementById('results-screen');
        this.finalScore = document.getElementById('final-score');
        this.scoreDetails = document.getElementById('score-details');
        this.shareBtn = document.getElementById('share-btn');
        this.shareText = document.getElementById('share-text');
        this.shareTextarea = document.getElementById('share-textarea');
        this.copyBtn = document.getElementById('copy-btn');
        this.countdown = document.getElementById('countdown');
        
        // Suggestion dialog elements
        this.suggestionDialog = document.getElementById('suggestion-dialog');
        this.suggestedAnswer = document.getElementById('suggested-answer');
        this.yesBtn = document.getElementById('yes-btn');
        this.noBtn = document.getElementById('no-btn');
        
        // Other UI elements
        this.closeResultsBtn = document.getElementById('close-results');
        this.reviewNav = document.getElementById('review-nav');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtnReview = document.getElementById('next-btn-review');
        this.reviewQuestion = document.getElementById('review-question');
        this.showResultsBtn = document.getElementById('show-results-btn');
        this.howToPlayModal = document.getElementById('how-to-play-modal');
        this.closeHowToPlayBtn = document.getElementById('close-how-to-play');
        this.rulesBtn = document.getElementById('rules-btn');
        this.subtitle = document.querySelector('.subtitle');
    }

    setupEventListeners() {
        // Main game interactions
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        this.nextBtn.addEventListener('click', () => this.handleNext());
        this.previousQuestionBtn.addEventListener('click', () => this.handlePrevious());
        
        // Modal interactions
        this.shareBtn.addEventListener('click', () => this.showShareText());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.closeResultsBtn.addEventListener('click', () => this.closeResults());
        
        // Suggestion dialog
        this.yesBtn.addEventListener('click', () => this.acceptSuggestion());
        this.noBtn.addEventListener('click', () => this.rejectSuggestion());
        
        // Review navigation
        this.prevBtn.addEventListener('click', () => this.previousAnswer());
        this.nextBtnReview.addEventListener('click', () => this.nextAnswer());
        this.showResultsBtn.addEventListener('click', () => this.showResults());
        
        // How to play modal
        this.closeHowToPlayBtn.addEventListener('click', () => this.closeHowToPlay());
        this.rulesBtn.addEventListener('click', () => this.showHowToPlay());
        
        // Input handling
        this.gameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.awaitingSuggestionResponse) {
                    return;
                } else if (!this.submitBtn.disabled && this.submitBtn.style.display !== 'none') {
                    this.handleSubmit();
                } else if (!this.nextBtn.classList.contains('hidden')) {
                    this.handleNext();
                }
            }
        });
        
        this.gameInput.addEventListener('input', () => {
            this.submitBtn.disabled = this.gameInput.value.trim().length === 0;
        });

        this.startCountdown();
    }

    // ===== ABSTRACT METHODS (Override in your implementation) =====
    
    /**
     * Render the current question's content in the game content area
     * @param {Object} item - Current theme item
     * @param {number} questionIndex - Current question index
     */
    renderGameContent(item, questionIndex) {
        throw new Error('renderGameContent method must be implemented');
    }
    
    /**
     * Process user input and return whether it's correct
     * @param {string} input - User input
     * @param {Object} item - Current theme item
     * @returns {boolean} - Whether the answer is correct
     */
    checkAnswer(input, item) {
        throw new Error('checkAnswer method must be implemented');
    }
    
    /**
     * Find closest match for suggestion system (optional)
     * @param {string} input - User input
     * @param {Object} item - Current theme item
     * @returns {string|null} - Suggested answer or null
     */
    findClosestMatch(input, item) {
        // Default implementation - override for fuzzy matching
        return null;
    }

    // ===== CORE GAME LOGIC =====
    
    getTodayGMT() {
        const now = new Date();
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();
        return new Date(utcYear, utcMonth, utcDate);
    }

    getDaysSinceEpoch() {
        const epoch = new Date(Date.UTC(
            this.config.launchDate.year, 
            this.config.launchDate.month, 
            this.config.launchDate.day
        ));
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const diffTime = todayUTC.getTime() - epoch.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    generateDailyItems() {
        const dayNumber = Math.max(1, this.getDaysSinceEpoch() + 1);
        const currentTheme = this.themes[dayNumber];
        
        if (currentTheme) {
            this.dailyItems = [...currentTheme.items];
            this.currentThemeName = currentTheme.name;
        } else {
            // Fallback to theme 1 if day not found
            this.dailyItems = [...this.themes[1].items];
            this.currentThemeName = this.themes[1].name;
        }
        
        this.updateThemeSubtitle();
    }

    updateThemeSubtitle() {
        if (this.subtitle && this.currentThemeName) {
            this.subtitle.innerHTML = `Today's Theme: <strong>${this.currentThemeName}</strong>`;
        }
    }

    loadTodaysGame() {
        const gameKey = this.getTodayGMT().toISOString().split('T')[0];
        const savedGame = localStorage.getItem(`${this.config.gameName.toLowerCase()}_game_${gameKey}`);
        
        if (savedGame) {
            const gameData = JSON.parse(savedGame);
            this.score = gameData.score;
            this.answers = gameData.answers;
            this.currentQuestionIndex = gameData.currentQuestionIndex;
            this.dailyItems = gameData.dailyItems;
            
            // Set theme name for saved games
            const dayNumber = Math.max(1, this.getDaysSinceEpoch() + 1);
            const currentTheme = this.themes[dayNumber];
            this.currentThemeName = currentTheme ? currentTheme.name : this.themes[1].name;
            this.updateThemeSubtitle();
            
            if (this.currentQuestionIndex >= this.totalQuestions) {
                this.showResults();
                return;
            }
        } else {
            this.generateDailyItems();
        }
        
        this.updateUI();
        this.displayCurrentQuestion();
    }

    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }

        const currentItem = this.dailyItems[this.currentQuestionIndex];
        
        // Render game-specific content
        this.renderGameContent(currentItem, this.currentQuestionIndex);
        
        // Update clue
        this.gameClue.textContent = currentItem.clue;
        
        // Reset input state
        this.gameInput.value = '';
        this.gameInput.disabled = false;
        this.submitBtn.disabled = true;
        this.submitBtn.style.display = 'block';
        this.nextBtn.classList.add('hidden');
        this.feedbackMessage.textContent = '';
        this.feedbackMessage.className = '';
        this.suggestionDialog.classList.add('hidden');
        this.awaitingSuggestionResponse = false;
        this.currentSuggestion = null;
    }

    handleSubmit() {
        if (this.awaitingSuggestionResponse) return;
        
        const input = this.gameInput.value.trim();
        if (!input) return;

        const currentItem = this.dailyItems[this.currentQuestionIndex];
        const isCorrect = this.checkAnswer(input, currentItem);
        
        if (isCorrect) {
            this.processCorrectAnswer(input, currentItem);
        } else {
            const closestMatch = this.findClosestMatch(input, currentItem);
            
            if (closestMatch) {
                this.showSuggestion(closestMatch, input, currentItem);
            } else {
                this.processIncorrectAnswer(input, currentItem);
            }
        }
    }

    processCorrectAnswer(input, item) {
        this.answers.push({
            question: this.currentQuestionIndex + 1,
            input: input,
            correct: true,
            answer: item.name
        });
        
        this.score++;
        this.currentScoreSpan.textContent = this.score;
        
        this.showFeedback(true, item.name);
        this.saveGame();
    }

    processIncorrectAnswer(input, item) {
        this.answers.push({
            question: this.currentQuestionIndex + 1,
            input: input,
            correct: false,
            answer: item.name
        });
        
        this.showFeedback(false, item.name);
        this.saveGame();
    }

    showFeedback(isCorrect, correctAnswer) {
        this.feedbackMessage.className = '';
        
        if (isCorrect) {
            this.feedbackMessage.textContent = "✅ Correct! Well done!";
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Wrong! The correct answer is ${correctAnswer}.`;
            this.feedbackMessage.classList.add('incorrect');
        }
        
        // Trigger shake animation
        this.feedbackMessage.classList.add('shake');
        
        // Remove shake class after animation completes
        setTimeout(() => {
            this.feedbackMessage.classList.remove('shake');
        }, 600);

        // Disable input
        this.gameInput.disabled = true;
        this.submitBtn.style.display = 'none';
        
        // Check if this was the final question
        if (this.currentQuestionIndex + 1 >= this.totalQuestions) {
            setTimeout(() => {
                this.showResults();
            }, 2000);
        } else {
            this.nextBtn.classList.remove('hidden');
        }
    }

    // ===== UI UPDATE METHODS =====
    
    updateUI() {
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsSpan.textContent = this.totalQuestions;
        this.currentScoreSpan.textContent = this.score;
        
        const progress = ((this.currentQuestionIndex) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Show Previous button if we have answered at least one question
        if ((this.answers.length > 0 && !this.inGameReviewMode) || 
            (this.inGameReviewMode && this.currentQuestionIndex > 0)) {
            this.previousQuestionBtn.classList.remove('hidden');
        } else {
            this.previousQuestionBtn.classList.add('hidden');
        }
    }

    handleNext() {
        if (this.reviewMode) {
            this.nextAnswer();
        } else if (this.inGameReviewMode) {
            if (this.currentQuestionIndex === this.answers.length - 1) {
                this.inGameReviewMode = false;
                this.currentQuestionIndex = this.answers.length;
                this.displayCurrentQuestion();
                this.nextBtn.textContent = 'Next Question';
            } else {
                this.currentQuestionIndex++;
                this.displayPreviousAnswer();
            }
        } else {
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

    handlePrevious() {
        if (this.reviewMode) {
            this.previousAnswer();
        } else {
            if (this.answers.length === 0) return;
            
            this.inGameReviewMode = true;
            
            if (this.currentQuestionIndex >= this.answers.length) {
                this.currentQuestionIndex = this.answers.length - 1;
            } else if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
            }
            
            this.displayPreviousAnswer();
            this.updateUI();
        }
    }

    displayPreviousAnswer() {
        const answer = this.answers[this.currentQuestionIndex];
        const item = this.dailyItems[this.currentQuestionIndex];
        
        // Render game content
        this.renderGameContent(item, this.currentQuestionIndex);
        this.gameClue.textContent = item.clue;
        
        // Show what was guessed
        this.gameInput.value = answer.input;
        this.gameInput.disabled = true;
        
        // Hide submit button
        this.submitBtn.style.display = 'none';
        
        // Show feedback
        this.feedbackMessage.className = '';
        if (answer.correct) {
            this.feedbackMessage.textContent = `✅ Your guess: "${answer.input}" - Correct!`;
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Your guess: "${answer.input}" - Wrong! Answer: ${answer.answer}`;
            this.feedbackMessage.classList.add('incorrect');
        }
        
        // Show next button
        this.nextBtn.classList.remove('hidden');
        this.nextBtn.textContent = this.currentQuestionIndex === this.answers.length - 1 ? 'Continue Game' : 'Next Answer';
    }

    // ===== SUGGESTION SYSTEM =====
    
    showSuggestion(suggestion, originalInput, item) {
        this.awaitingSuggestionResponse = true;
        this.currentSuggestion = {
            suggestion: suggestion,
            originalInput: originalInput,
            item: item
        };
        
        this.suggestedAnswer.textContent = suggestion;
        this.suggestionDialog.classList.remove('hidden');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Disable input while waiting for response
        this.gameInput.disabled = true;
        this.submitBtn.disabled = true;
    }

    acceptSuggestion() {
        this.suggestionDialog.classList.add('hidden');
        this.awaitingSuggestionResponse = false;
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        this.processCorrectAnswer(this.currentSuggestion.suggestion, this.currentSuggestion.item);
        this.currentSuggestion = null;
    }

    rejectSuggestion() {
        this.suggestionDialog.classList.add('hidden');
        this.awaitingSuggestionResponse = false;
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        this.processIncorrectAnswer(this.currentSuggestion.originalInput, this.currentSuggestion.item);
        this.currentSuggestion = null;
    }

    // ===== RESULTS & SHARING =====
    
    showResults() {
        if (this.reviewMode) {
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

    showShareText() {
        const daysSinceEpoch = this.getDaysSinceEpoch();
        const dayNumber = Math.max(1, daysSinceEpoch + 1);
        const formattedDayNumber = dayNumber.toString().padStart(2, '0');
        
        let shareString = `${this.config.gameName} ${formattedDayNumber} ${this.score}/5\n\n`;
        
        this.answers.forEach((answer) => {
            shareString += answer.correct ? '🟩 ' : '🟥 ';
        });
        
        shareString += `\n\n${this.config.shareTagline}\n${this.config.shareUrl}`;
        
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

    closeResults() {
        this.resultsScreen.classList.add('hidden');
        this.reviewMode = true;
        this.currentReviewIndex = 0;
        this.showReviewMode();
    }

    showReviewMode() {
        document.querySelector('.progress-container').style.display = 'block';
        document.querySelector('.input-container').style.display = 'flex';
        document.querySelector('.feedback-container').style.display = 'flex';
        
        this.reviewNav.classList.add('hidden');
        this.displayReviewAnswer();
    }

    displayReviewAnswer() {
        const reviewAnswer = this.answers[this.currentReviewIndex];
        const reviewItem = this.dailyItems[this.currentReviewIndex];
        
        this.renderGameContent(reviewItem, this.currentReviewIndex);
        this.gameClue.textContent = reviewItem.clue;
        
        // Update progress bar
        this.currentQuestionSpan.textContent = this.currentReviewIndex + 1;
        const progress = ((this.currentReviewIndex + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Show the user's guess
        this.gameInput.value = reviewAnswer.input;
        this.gameInput.disabled = true;
        
        // Hide submit button, show navigation
        this.submitBtn.style.display = 'none';
        this.previousQuestionBtn.classList.remove('hidden');
        this.nextBtn.classList.remove('hidden');
        
        this.previousQuestionBtn.textContent = 'Previous';
        this.previousQuestionBtn.disabled = this.currentReviewIndex === 0;
        this.nextBtn.textContent = this.currentReviewIndex === this.answers.length - 1 ? 'View Results' : 'Next';
        this.nextBtn.disabled = false;
        
        // Show feedback
        this.feedbackMessage.className = '';
        if (reviewAnswer.correct) {
            this.feedbackMessage.textContent = `✅ Your guess: "${reviewAnswer.input}" - Correct!`;
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Your guess: "${reviewAnswer.input}" - Wrong! Answer: ${reviewAnswer.answer}`;
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
            this.showResults();
        }
    }

    updateProgress() {
        const progress = 100;
        this.progressFill.style.width = `${progress}%`;
    }

    // ===== HOW TO PLAY MODAL =====
    
    showHowToPlay() {
        this.howToPlayModal.classList.remove('hidden');
    }

    closeHowToPlay() {
        this.howToPlayModal.classList.add('hidden');
    }

    checkFirstVisit() {
        const hasVisited = localStorage.getItem(`${this.config.gameName.toLowerCase()}_has_visited`);
        if (!hasVisited) {
            this.showHowToPlay();
            localStorage.setItem(`${this.config.gameName.toLowerCase()}_has_visited`, 'true');
        }
    }

    // ===== UTILITY METHODS =====
    
    startCountdown() {
        const updateCountdown = () => {
            const now = new Date();
            const currentUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
                                       now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            
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
            dailyItems: this.dailyItems
        };
        localStorage.setItem(`${this.config.gameName.toLowerCase()}_game_${gameKey}`, JSON.stringify(gameData));
    }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Levenshtein distance algorithm for fuzzy matching
 * Use this in your findClosestMatch implementation
 */
function levenshteinDistance(str1, str2) {
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

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DailyGameTemplate, GAME_CONFIG, THEMES_TEMPLATE, levenshteinDistance };
}