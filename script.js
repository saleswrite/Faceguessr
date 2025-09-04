const themes = {
    1: {
        name: "Historical Faces",
        figures: [
            {
                name: "Hypatia of Alexandria",
                alternativeNames: ["Hypatia", "Hypathia", "Hypatia of Alexandria"],
                clue: "A voice of reason in the Library's twilight, silenced by zeal.",
                imageUrl: "images/faceguessr01/hypatia.jpg"
            },
            {
                name: "Sitting Bull",
                alternativeNames: ["Sitting Bull", "Tatanka Iyotanka", "Sitting", "Bull"],
                clue: "A vision of horses and a stand at Little Bighorn.",
                imageUrl: "images/faceguessr01/sittingbull.jpg"
            },
            {
                name: "Imhotep",
                alternativeNames: ["Imhotep", "Imouthes"],
                clue: "Stone stacked for eternity by a healer of kings.",
                imageUrl: "images/faceguessr01/imhotep.jpg"
            },
            {
                name: "Florence Nightingale",
                alternativeNames: ["Florence Nightingale", "Lady with the Lamp", "Florence", "Nightingale"],
                clue: "A shadow with a lamp in a Crimean night.",
                imageUrl: "images/faceguessr01/florencenightingale.avif"
            },
            {
                name: "Toussaint Louverture",
                alternativeNames: ["Toussaint Louverture", "Toussaint L'Ouverture", "François-Dominique Toussaint Louverture", "Toussaint", "Louverture"],
                clue: "A Black Jacobin whose revolution burned brighter than Napoleon's star.",
                imageUrl: "images/faceguessr01/Toussaint_Louverture.jpg"
            }
        ]
    },
    2: {
        name: "Business Faces",
        figures: [
            {
                name: "Kevin O'Leary",
                alternativeNames: ["Kevin O'Leary", "Mr. Wonderful", "Kevin", "O'Leary", "Mr Wonderful"],
                clue: "A sharp tongue on screens, a 'dragon' with polished shoes, fortune whispered in cold cash.",
                imageUrl: "images/Faceguessr 02/kevinoleary.jpg"
            },
            {
                name: "Peter Thiel",
                alternativeNames: ["Peter Thiel", "Peter Andreas Thiel", "Peter", "Thiel"],
                clue: "From the depths of online payments to the heights of data's gaze, a contrarian mind sails west.",
                imageUrl: "images/Faceguessr 02/peterthiel.jpg"
            },
            {
                name: "Phil Knight",
                alternativeNames: ["Phil Knight", "Philip Knight", "Philip Hampson Knight", "Phil", "Philip", "Knight"],
                clue: "A swoosh born from Oregon tracks, running shoes turned empire — yet the man lingers in shadow.",
                imageUrl: "images/Faceguessr 02/Phil-Knight-Nike-2017 (1).webp"
            },
            {
                name: "Satya Nadella",
                alternativeNames: ["Satya Nadella", "Satya Narayana Nadella", "Satya", "Nadella"],
                clue: "From cricket pitches to the cloud, a quiet hand steers an empire of windows toward the sky.",
                imageUrl: "images/Faceguessr 02/satyanadella.jpg"
            },
            {
                name: "Steve Wozniak",
                alternativeNames: ["Steve Wozniak", "Stephen Wozniak", "Woz", "Stephen Gary Wozniak", "Steve", "Stephen", "Wozniak"],
                clue: "The engineer in the garage, wires and chips his canvas; a prankster behind the fruit's first bite.",
                imageUrl: "images/Faceguessr 02/stevewozniak.jpg"
            }
        ]
    },
    3: {
        name: "TV Character Faces",
        figures: [
            {
                name: "Alan Partridge",
                alternativeNames: ["Alan Partridge", "Alan", "Partridge", "A.P.", "AP"],
                clue: "Awkward broadcaster nesting in pear tree?",
                imageUrl: "images/Faceguessr 03/alan partridge .webp"
            },
            {
                name: "George Costanza",
                alternativeNames: ["George Costanza", "George", "Costanza", "George Louis Costanza", "Georgie"],
                clue: "Bald man constructs excuses constantly",
                imageUrl: "images/Faceguessr 03/George-costanza.webp"
            },
            {
                name: "Dr. Nick",
                alternativeNames: ["Dr. Nick", "Dr Nick", "Doctor Nick", "Nick", "Dr. Riviera", "Nick Riviera", "Doctor Riviera", "Hi Everybody"],
                clue: "Quack waves hello to everyone!",
                imageUrl: "images/Faceguessr 03/Dr Nick.jpg"
            },
            {
                name: "Dwight Schrute",
                alternativeNames: ["Dwight Schrute", "Dwight", "Schrute", "Dwight K. Schrute", "Dwight Kurt Schrute", "Assistant Regional Manager"],
                clue: "Beet farmer's right with such weird truth",
                imageUrl: "images/Faceguessr 03/Dwight_Schrute.jpg"
            },
            {
                name: "Frasier Crane",
                alternativeNames: ["Frasier Crane", "Frasier", "Crane", "Dr. Crane", "Dr Crane", "Dr. Frasier Crane"],
                clue: "Radio shrink takes flight",
                imageUrl: "images/Faceguessr 03/frasier crane.jpg"
            }
        ]
    }
};

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
        this.subtitle = document.querySelector('.subtitle');
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
        return new Date(Date.UTC(utcYear, utcMonth, utcDate));
    }

    getDaysSinceEpoch() {
        // Game launch date - September 3, 2025 is day 1
        const epoch = new Date(Date.UTC(2025, 8, 3)); // Month is 0-indexed, so 8 = September
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const diffTime = todayUTC.getTime() - epoch.getTime();
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
            
            // Set theme name for saved games
            const dayNumber = Math.max(1, this.getDaysSinceEpoch() + 1);
            const currentTheme = themes[dayNumber];
            this.currentThemeName = currentTheme ? currentTheme.name : themes[1].name;
            this.updateThemeSubtitle();
            
            if (this.answers.length >= this.totalQuestions) {
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
        // Get current day number to determine theme
        const dayNumber = Math.max(1, this.getDaysSinceEpoch() + 1);
        const currentTheme = themes[dayNumber];
        
        if (currentTheme) {
            this.dailyFigures = [...currentTheme.figures];
            this.currentThemeName = currentTheme.name;
        } else {
            // Fallback to theme 1 if day not found
            this.dailyFigures = [...themes[1].figures];
            this.currentThemeName = themes[1].name;
        }
        
        // Update the subtitle with current theme
        this.updateThemeSubtitle();
    }

    updateThemeSubtitle() {
        if (this.subtitle && this.currentThemeName) {
            this.subtitle.innerHTML = `Today's Theme: <strong>${this.currentThemeName}</strong>`;
        }
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
        this.personImage.alt = `Person ${this.currentQuestionIndex + 1}`;
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
            
            // Check for partial matches (nickname/first name only)
            const nameWords = normalizedName.split(' ');
            const guessWords = normalizedGuess.split(' ');
            
            // Check if guess matches any single word in the name (for nicknames)
            let foundPartialMatch = false;
            nameWords.forEach(nameWord => {
                guessWords.forEach(guessWord => {
                    if (nameWord.length >= 3 && guessWord.length >= 3) {
                        const wordDistance = this.levenshteinDistance(guessWord, nameWord);
                        const wordSimilarity = 1 - (wordDistance / Math.max(guessWord.length, nameWord.length));
                        if (wordSimilarity > 0.75 && !foundPartialMatch) {
                            bestMatch = name;
                            foundPartialMatch = true;
                        }
                    }
                });
            });
            
            // Full name comparison with more generous threshold
            const distance = this.levenshteinDistance(normalizedGuess, normalizedName);
            const similarity = 1 - (distance / Math.max(normalizedGuess.length, normalizedName.length));
            
            // More generous matching: similarity > 60% and distance <= 4, or very short names
            const isShortName = Math.min(normalizedGuess.length, normalizedName.length) <= 6;
            const threshold = isShortName ? 0.5 : 0.6;
            const maxDistance = isShortName ? 2 : 4;
            
            if (similarity > threshold && distance <= maxDistance && similarity > bestSimilarity) {
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
        const daysSinceEpoch = this.getDaysSinceEpoch();
        const dayNumber = Math.max(1, daysSinceEpoch + 1);
        const formattedDayNumber = dayNumber.toString().padStart(2, '0');
        
        let shareString = `FaceGuessr ${formattedDayNumber} ${this.score}/5\n\n`;
        
        this.answers.forEach((answer) => {
            shareString += answer.correct ? '🟩 ' : '🟥 ';
        });
        
        shareString += `\n\nGuess 5 faces daily - new theme every day!\nhttps://saleswrite.github.io/Faceguessr/`;
        
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
            const currentUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
                                       now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            
            // Calculate next midnight GMT
            const nextMidnightUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0);
            
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