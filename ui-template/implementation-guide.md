# Implementation Guide: Daily Game UI Template

This guide walks you through creating a new daily game using the UI template, step by step.

## 🎯 Planning Your Game

Before coding, define:

1. **Game Concept**: What are players guessing?
2. **Content Type**: Images, text, audio, video?
3. **Themes**: What categories will rotate daily?
4. **Difficulty**: How challenging should it be?
5. **Clue Style**: Cryptic, straightforward, progressive?

## 📋 Step-by-Step Implementation

### Step 1: Project Setup

```bash
# Create your game directory
mkdir my-daily-game
cd my-daily-game

# Copy template files
cp -r ui-template/* .

# Rename files to your game name
mv template.html index.html
mv template-script.js script.js  
mv template-styles.css style.css
```

### Step 2: Configure Your Game

Edit the configuration in `script.js`:

```javascript
const GAME_CONFIG = {
    // Game Identity
    gameName: "MyGame",           // Used in localStorage keys
    gameType: "trivia",           // Used in page title
    totalQuestions: 5,            // Questions per day
    
    // Launch Configuration
    launchDate: {
        year: 2025,
        month: 8,    // 0-indexed (8 = September)
        day: 3       // Launch day
    },
    
    // Share Configuration  
    shareUrl: "https://mydomain.com/mygame/",
    shareTagline: "Play 5 daily trivia questions!",
    
    // UI Text Configuration
    inputPlaceholder: "Enter your answer...",
    submitButtonText: "Submit Answer", 
    footerText: "5 questions daily • Resets at midnight GMT",
    
    // Rules Configuration
    rulesIntro: "Guess the answer based on the clue provided.",
    rules: [
        "Each day features a different theme",
        "You get one guess per question",
        "Use the clue to help identify the answer", 
        "Correct answers show ✅, wrong answers show ❌",
        "Share your daily score with friends!"
    ]
};
```

### Step 3: Define Your Themes

Create your themes data structure:

```javascript
const THEMES = {
    1: {
        name: "Movie Quotes",
        items: [
            {
                name: "Casablanca",
                alternativeNames: ["Casablanca", "Casa Blanca"],
                clue: "Here's looking at you, kid.",
                contentData: {
                    type: "quote",
                    quote: "Here's looking at you, kid.",
                    year: 1942
                }
            },
            {
                name: "The Godfather", 
                alternativeNames: ["The Godfather", "Godfather"],
                clue: "I'm gonna make him an offer he can't refuse.",
                contentData: {
                    type: "quote", 
                    quote: "I'm gonna make him an offer he can't refuse.",
                    year: 1972
                }
            }
            // ... 3 more items for total of 5
        ]
    },
    2: {
        name: "Famous Landmarks",
        items: [
            {
                name: "Eiffel Tower",
                alternativeNames: ["Eiffel Tower", "Tour Eiffel"],
                clue: "Iron lady standing tall in the City of Light.",
                contentData: {
                    type: "image",
                    imageUrl: "images/eiffel-tower.jpg",
                    location: "Paris, France"
                }
            }
            // ... 4 more landmarks
        ]
    }
    // ... more themes
};
```

### Step 4: Create Your Game Class

```javascript
class MyDailyGame extends DailyGameTemplate {
    constructor() {
        super(THEMES, GAME_CONFIG);
    }

    renderGameContent(item, questionIndex) {
        const contentData = item.contentData;
        
        switch(contentData.type) {
            case 'quote':
                this.gameContent.innerHTML = `
                    <div class="quote-container">
                        <blockquote>"${contentData.quote}"</blockquote>
                        <p class="quote-year">(${contentData.year})</p>
                    </div>
                `;
                break;
                
            case 'image':
                this.gameContent.innerHTML = `
                    <img src="${contentData.imageUrl}" 
                         alt="Question ${questionIndex + 1}"
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
                `;
                break;
                
            default:
                this.gameContent.innerHTML = `
                    <div class="default-content">
                        <h3>Question ${questionIndex + 1}</h3>
                        <p>Content type: ${contentData.type}</p>
                    </div>
                `;
        }
    }

    checkAnswer(input, item) {
        const normalizedInput = input.toLowerCase().trim();
        const normalizedName = item.name.toLowerCase();
        
        // Check exact match first
        if (normalizedInput === normalizedName) {
            return true;
        }
        
        // Check alternative names
        return item.alternativeNames.some(altName => 
            altName.toLowerCase() === normalizedInput
        );
    }

    findClosestMatch(input, item) {
        const normalizedInput = input.toLowerCase().trim();
        let bestMatch = null;
        let bestSimilarity = 0;
        
        const allNames = [item.name, ...item.alternativeNames];
        
        allNames.forEach(name => {
            const normalizedName = name.toLowerCase();
            const distance = levenshteinDistance(normalizedInput, normalizedName);
            const similarity = 1 - (distance / Math.max(normalizedInput.length, normalizedName.length));
            
            // Consider it close if similarity > 70% and distance <= 3
            if (similarity > 0.7 && distance <= 3 && similarity > bestSimilarity) {
                bestMatch = name;
                bestSimilarity = similarity;
            }
        });
        
        return bestMatch;
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new MyDailyGame();
});
```

### Step 5: Customize HTML

Update `index.html` with your game's information:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyGame - Daily Trivia Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <button id="rules-btn" class="rules-btn">Rules</button>
            <h1>MyGame</h1>
            <p class="subtitle">Today's Theme: <strong>Movie Quotes</strong></p>
            <!-- ... rest of header -->
        </header>

        <main>
            <div class="game-board">
                <div class="content-container">
                    <div id="game-content">
                        <!-- Your game content will be rendered here -->
                    </div>
                </div>
                
                <div class="clue-container">
                    <p id="game-clue">Your clue will appear here</p>
                </div>

                <div class="input-container">
                    <input 
                        type="text" 
                        id="game-input" 
                        placeholder="Enter your answer..."
                        maxlength="50"
                    />
                    <div class="button-container">
                        <button id="previous-question-btn" class="hidden">Previous</button>
                        <button id="submit-btn">Submit Answer</button>
                        <button id="next-btn" class="hidden">Next Question</button>
                    </div>
                </div>
                <!-- ... rest of game board -->
            </div>
        </main>

        <footer>
            <p>5 questions daily • Resets at midnight GMT • Score: <span id="current-score">0</span>/5</p>
        </footer>

        <!-- How to Play Popup -->
        <div id="how-to-play-modal" class="how-to-play-modal hidden">
            <div class="how-to-play-content">
                <button id="close-how-to-play" class="close-btn">&times;</button>
                <h2>How to Play</h2>
                <div class="rules-explanation">
                    <p class="rules-intro">Guess the answer based on the clue provided.</p>
                    
                    <div class="rules-section">
                        <h3>Game Rules</h3>
                        <ul class="rules-list">
                            <li>Each day features a different theme</li>
                            <li>You get one guess per question</li>
                            <li>Use the clue to help identify the answer</li>
                            <li>Correct answers show ✅, wrong answers show ❌</li>
                            <li>Share your daily score with friends!</li>
                        </ul>
                    </div>
                    
                    <div class="rules-footer">
                        <p>New puzzles daily at midnight GMT • Come back tomorrow for a fresh challenge!</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- ... rest of modals -->
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### Step 6: Add Game-Specific Styles

Add custom styles to `style.css`:

```css
/* Add after the template styles */

/* Quote-specific styling */
.quote-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 20px;
    text-align: center;
}

.quote-container blockquote {
    font-size: 1.2rem;
    font-style: italic;
    color: #d4d4d4;
    margin-bottom: 15px;
    line-height: 1.4;
}

.quote-year {
    color: #818384;
    font-size: 0.9rem;
}

/* Image-specific styling */
.image-content img {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Responsive adjustments for your content */
@media (max-width: 600px) {
    .quote-container blockquote {
        font-size: 1rem;
    }
    
    .quote-container {
        padding: 15px;
    }
}
```

### Step 7: Testing Checklist

- [ ] Game loads without errors
- [ ] Theme switches based on day
- [ ] Input validation works
- [ ] Suggestion system works (if implemented)
- [ ] Progress tracking works
- [ ] Results screen displays correctly
- [ ] Share functionality works
- [ ] Review mode navigation works
- [ ] Mobile responsive design
- [ ] Accessibility (keyboard navigation)
- [ ] LocalStorage persistence
- [ ] Rules modal displays correctly
- [ ] Countdown timer works

### Step 8: Content Management

Create a content management system:

```javascript
// content-manager.js
class ContentManager {
    constructor() {
        this.themes = {};
    }

    addTheme(dayNumber, themeName, items) {
        this.themes[dayNumber] = {
            name: themeName,
            items: items
        };
    }

    validateTheme(theme) {
        if (!theme.name) throw new Error("Theme must have a name");
        if (!Array.isArray(theme.items)) throw new Error("Theme must have items array");
        if (theme.items.length !== 5) throw new Error("Theme must have exactly 5 items");
        
        theme.items.forEach((item, index) => {
            if (!item.name) throw new Error(`Item ${index} missing name`);
            if (!item.clue) throw new Error(`Item ${index} missing clue`);
            if (!item.alternativeNames || !Array.isArray(item.alternativeNames)) {
                throw new Error(`Item ${index} missing alternativeNames array`);
            }
        });
    }

    exportThemes() {
        return JSON.stringify(this.themes, null, 2);
    }

    importThemes(jsonString) {
        const themes = JSON.parse(jsonString);
        Object.values(themes).forEach(theme => this.validateTheme(theme));
        this.themes = themes;
    }
}
```

## 🎨 Advanced Customization

### Custom Animations

```css
/* Add loading animation for content */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.content-container {
    animation: fadeIn 0.3s ease-out;
}

/* Add pulse effect for correct answers */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

#feedback-message.correct {
    animation: pulse 0.5s ease-in-out;
}
```

### Progressive Enhancement

```javascript
// Add enhanced features for modern browsers
class EnhancedDailyGame extends MyDailyGame {
    constructor() {
        super();
        
        // Add enhanced features
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
        
        if ('share' in navigator) {
            this.enableNativeSharing();
        }
    }

    async registerServiceWorker() {
        try {
            await navigator.serviceWorker.register('sw.js');
        } catch (error) {
            console.log('SW registration failed');
        }
    }

    enableNativeSharing() {
        this.shareBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                await navigator.share({
                    title: `${this.config.gameName} Results`,
                    text: this.shareTextarea.value,
                    url: window.location.href
                });
            } catch (err) {
                // Fallback to original sharing
                this.showShareText();
            }
        });
    }
}
```

## 🚀 Deployment

### Static Deployment (Recommended)

```bash
# Build process (if needed)
npm run build

# Deploy to static host (Netlify, Vercel, GitHub Pages)
# Or upload to your web server
```

### CDN Configuration

```html
<!-- Add to <head> for better performance -->
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="script.js" as="script">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

### Service Worker (Optional)

```javascript
// sw.js
const CACHE_NAME = 'mygame-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/images/'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Theme not loading**: Check day calculation and theme data structure
2. **LocalStorage issues**: Verify game key naming consistency
3. **Mobile layout problems**: Test responsive breakpoints
4. **Share text formatting**: Verify string concatenation
5. **Input validation errors**: Check alternative names array

### Debug Mode

```javascript
// Add debug mode to your game
class MyDailyGame extends DailyGameTemplate {
    constructor() {
        super();
        
        // Enable debug mode with URL parameter
        this.debugMode = new URLSearchParams(window.location.search).has('debug');
        
        if (this.debugMode) {
            this.enableDebugMode();
        }
    }

    enableDebugMode() {
        // Add debug panel
        document.body.innerHTML += `
            <div id="debug-panel" style="position: fixed; top: 10px; right: 10px; background: #333; color: white; padding: 10px; border-radius: 5px; font-size: 12px;">
                <div>Day: ${this.getDaysSinceEpoch() + 1}</div>
                <div>Theme: ${this.currentThemeName}</div>
                <div>Score: ${this.score}/${this.totalQuestions}</div>
                <button onclick="localStorage.clear(); location.reload();">Reset Game</button>
            </div>
        `;
        
        // Log all interactions
        console.log('Debug mode enabled');
        console.log('Themes:', this.themes);
        console.log('Current items:', this.dailyItems);
    }
}
```

This implementation guide should help you create a fully functional daily game using the UI template! 🎮