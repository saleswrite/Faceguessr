/**
 * FaceGuessr Implementation Example
 * Shows how FaceGuessr was built using the Daily Game UI Template
 */

// FaceGuessr Configuration
const FACEGUESSR_CONFIG = {
    gameName: "FaceGuessr",
    gameType: "Historical Figure Game",
    totalQuestions: 5,
    
    launchDate: {
        year: 2025,
        month: 8, // September (0-indexed)
        day: 3
    },
    
    shareUrl: "https://saleswrite.github.io/Faceguessr/",
    shareTagline: "Guess 5 new faces daily - new theme every day!",
    
    inputPlaceholder: "Enter your guess...",
    submitButtonText: "Submit Guess",
    footerText: "5 faces daily • Resets at midnight GMT",
    
    rulesIntro: "Guess the 5 faces from today's theme using their photos and cryptic clues.",
    rules: [
        "Each day features a different theme (Historical Faces, Musicians, Athletes, etc.)",
        "You get <strong>one guess per face</strong> - make it count!",
        "Use the cryptic clue to help identify each person",
        "Correct answers show ✅, wrong answers show ❌",
        "Share your daily score with friends!"
    ]
};

// FaceGuessr Themes Data
const FACEGUESSR_THEMES = {
    1: {
        name: "Historical Faces",
        items: [
            {
                name: "Hypatia of Alexandria",
                alternativeNames: ["Hypatia", "Hypathia"],
                clue: "A voice of reason in the Library's twilight, silenced by zeal.",
                contentData: {
                    type: "image",
                    imageUrl: "images/hypatia.jpg"
                }
            },
            {
                name: "Sitting Bull",
                alternativeNames: ["Sitting Bull", "Tatanka Iyotanka"],
                clue: "A vision of horses and a stand at Little Bighorn.",
                contentData: {
                    type: "image",
                    imageUrl: "images/sittingbull.jpg"
                }
            },
            {
                name: "Imhotep",
                alternativeNames: ["Imhotep", "Imouthes"],
                clue: "Stone stacked for eternity by a healer of kings.",
                contentData: {
                    type: "image",
                    imageUrl: "images/imhotep.jpg"
                }
            },
            {
                name: "Florence Nightingale",
                alternativeNames: ["Florence Nightingale", "Lady with the Lamp"],
                clue: "A shadow with a lamp in a Crimean night.",
                contentData: {
                    type: "image",
                    imageUrl: "images/florencenightingale.avif"
                }
            },
            {
                name: "Toussaint Louverture",
                alternativeNames: ["Toussaint Louverture", "Toussaint L'Ouverture", "François-Dominique Toussaint Louverture"],
                clue: "A Black Jacobin whose revolution burned brighter than Napoleon's star.",
                contentData: {
                    type: "image",
                    imageUrl: "images/Toussaint_Louverture.jpg"
                }
            }
        ]
    },
    2: {
        name: "Business Faces",
        items: [
            {
                name: "Kevin O'Leary",
                alternativeNames: ["Kevin O'Leary", "Mr. Wonderful"],
                clue: "A sharp tongue on screens, a 'dragon' with polished shoes, fortune whispered in cold cash.",
                contentData: {
                    type: "image",
                    imageUrl: "images/kevin_oleary.jpg"
                }
            },
            {
                name: "Peter Thiel",
                alternativeNames: ["Peter Thiel", "Peter Andreas Thiel"],
                clue: "From the depths of online payments to the heights of data's gaze, a contrarian mind sails west.",
                contentData: {
                    type: "image",
                    imageUrl: "images/peter_thiel.jpg"
                }
            },
            {
                name: "Phil Knight",
                alternativeNames: ["Phil Knight", "Philip Knight", "Philip Hampson Knight"],
                clue: "A swoosh born from Oregon tracks, running shoes turned empire — yet the man lingers in shadow.",
                contentData: {
                    type: "image",
                    imageUrl: "images/phil_knight.jpg"
                }
            },
            {
                name: "Satya Nadella",
                alternativeNames: ["Satya Nadella", "Satya Narayana Nadella"],
                clue: "From cricket pitches to the cloud, a quiet hand steers an empire of windows toward the sky.",
                contentData: {
                    type: "image",
                    imageUrl: "images/satya_nadella.jpg"
                }
            },
            {
                name: "Steve Wozniak",
                alternativeNames: ["Steve Wozniak", "Stephen Wozniak", "Woz", "Stephen Gary Wozniak"],
                clue: "The engineer in the garage, wires and chips his canvas; a prankster behind the fruit's first bite.",
                contentData: {
                    type: "image",
                    imageUrl: "images/steve_wozniak.jpg"
                }
            }
        ]
    }
};

// FaceGuessr Game Implementation
class FaceGuessrGame extends DailyGameTemplate {
    constructor() {
        super(FACEGUESSR_THEMES, FACEGUESSR_CONFIG);
    }

    /**
     * Render the person's image in the game content area
     */
    renderGameContent(item, questionIndex) {
        const imageData = item.contentData;
        
        this.gameContent.innerHTML = `
            <img src="${imageData.imageUrl}" 
                 alt="Historical figure ${questionIndex + 1}"
                 style="width: 100%; height: 100%; object-fit: cover; display: block;" />
        `;
    }

    /**
     * Check if the user's guess matches the person's name or alternative names
     */
    checkAnswer(input, item) {
        const normalizedInput = input.toLowerCase().trim();
        const normalizedName = item.name.toLowerCase();
        
        // Check exact name match first
        if (normalizedInput === normalizedName) {
            return true;
        }
        
        // Check alternative names
        return item.alternativeNames.some(altName => 
            altName.toLowerCase() === normalizedInput
        );
    }

    /**
     * Implement fuzzy matching for close spellings
     * Returns closest match if similarity > 70% and distance <= 3
     */
    findClosestMatch(input, item) {
        const normalizedInput = input.toLowerCase().trim();
        const allNames = [item.name, ...item.alternativeNames];
        
        let bestMatch = null;
        let bestDistance = Infinity;
        let bestSimilarity = 0;
        
        allNames.forEach(name => {
            const normalizedName = name.toLowerCase();
            const distance = levenshteinDistance(normalizedInput, normalizedName);
            const similarity = 1 - (distance / Math.max(normalizedInput.length, normalizedName.length));
            
            // Consider it a close match if similarity > 70% and distance <= 3
            if (similarity > 0.7 && distance <= 3 && similarity > bestSimilarity) {
                bestMatch = name;
                bestDistance = distance;
                bestSimilarity = similarity;
            }
        });
        
        return bestMatch;
    }

    /**
     * Override to use 'guess' instead of 'input' for answer storage
     * (maintains compatibility with original FaceGuessr structure)
     */
    processCorrectAnswer(input, item) {
        this.answers.push({
            question: this.currentQuestionIndex + 1,
            guess: input, // Use 'guess' key for FaceGuessr compatibility
            correct: true,
            answer: item.name
        });
        
        this.score++;
        this.currentScoreSpan.textContent = this.score;
        
        this.showFeedback(true, item.name);
        this.saveGame();
    }

    /**
     * Override to use 'guess' instead of 'input' for answer storage
     */
    processIncorrectAnswer(input, item) {
        this.answers.push({
            question: this.currentQuestionIndex + 1,
            guess: input, // Use 'guess' key for FaceGuessr compatibility
            correct: false,
            answer: item.name
        });
        
        this.showFeedback(false, item.name);
        this.saveGame();
    }

    /**
     * Override feedback display to match FaceGuessr format in review mode
     */
    displayPreviousAnswer() {
        const answer = this.answers[this.currentQuestionIndex];
        const item = this.dailyItems[this.currentQuestionIndex];
        
        // Display the image
        this.renderGameContent(item, this.currentQuestionIndex);
        this.gameClue.textContent = item.clue;
        
        // Show what was guessed
        this.gameInput.value = answer.guess;
        this.gameInput.disabled = true;
        
        // Hide submit button
        this.submitBtn.style.display = 'none';
        
        // Show feedback with FaceGuessr format
        this.feedbackMessage.className = '';
        if (answer.correct) {
            this.feedbackMessage.textContent = `✅ Your guess: "${answer.guess}" - Correct!`;
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Your guess: "${answer.guess}" - Wrong! Answer: ${answer.answer}`;
            this.feedbackMessage.classList.add('incorrect');
        }
        
        // Show next button
        this.nextBtn.classList.remove('hidden');
        this.nextBtn.textContent = this.currentQuestionIndex === this.answers.length - 1 ? 'Continue Game' : 'Next Answer';
    }

    /**
     * Override review mode display to use FaceGuessr format
     */
    displayReviewAnswer() {
        const reviewAnswer = this.answers[this.currentReviewIndex];
        const reviewItem = this.dailyItems[this.currentReviewIndex];
        
        // Update the image and clue
        this.renderGameContent(reviewItem, this.currentReviewIndex);
        this.gameClue.textContent = reviewItem.clue;
        
        // Update progress bar
        this.currentQuestionSpan.textContent = this.currentReviewIndex + 1;
        const progress = ((this.currentReviewIndex + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Show the user's guess
        this.gameInput.value = reviewAnswer.guess;
        this.gameInput.disabled = true;
        
        // Hide submit button, show navigation
        this.submitBtn.style.display = 'none';
        this.previousQuestionBtn.classList.remove('hidden');
        this.nextBtn.classList.remove('hidden');
        
        this.previousQuestionBtn.textContent = 'Previous';
        this.previousQuestionBtn.disabled = this.currentReviewIndex === 0;
        this.nextBtn.textContent = this.currentReviewIndex === this.answers.length - 1 ? 'View Results' : 'Next';
        this.nextBtn.disabled = false;
        
        // Show feedback with FaceGuessr format
        this.feedbackMessage.className = '';
        if (reviewAnswer.correct) {
            this.feedbackMessage.textContent = `✅ Your guess: "${reviewAnswer.guess}" - Correct!`;
            this.feedbackMessage.classList.add('correct');
        } else {
            this.feedbackMessage.textContent = `❌ Your guess: "${reviewAnswer.guess}" - Wrong! Answer: ${reviewAnswer.answer}`;
            this.feedbackMessage.classList.add('incorrect');
        }
    }
}

// Initialize FaceGuessr when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FaceGuessrGame();
});

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        FaceGuessrGame, 
        FACEGUESSR_CONFIG, 
        FACEGUESSR_THEMES 
    };
}

/**
 * Key Implementation Notes for FaceGuessr:
 * 
 * 1. **Image Content**: Uses 280x280px image container for historical figure photos
 * 
 * 2. **Cryptic Clues**: Each figure has a poetic/cryptic clue that hints at their identity
 * 
 * 3. **Alternative Names**: Supports multiple name variations (nicknames, full names, etc.)
 * 
 * 4. **Fuzzy Matching**: Implements "Did you mean?" for close spellings using Levenshtein distance
 * 
 * 5. **Theme Rotation**: Daily themes (Historical Faces, Business Faces, etc.) based on day number
 * 
 * 6. **Answer Format**: Uses 'guess' key instead of 'input' for consistency with original
 * 
 * 7. **Review Modes**: Supports both in-game review (Previous button) and post-game review
 * 
 * 8. **Visual Feedback**: 
 *    - ✅/❌ emojis for correct/wrong answers
 *    - Shake animation on feedback
 *    - Progress bars in results (green for correct, red for wrong)
 * 
 * 9. **Sharing**: Formatted share text with game number, score, and colored squares
 * 
 * 10. **Mobile Optimization**: Responsive design with specific mobile breakpoints
 */