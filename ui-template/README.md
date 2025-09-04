# Daily Game UI Template

A comprehensive, reusable UI template for creating daily puzzle games inspired by Wordle and based on the FaceGuessr architecture.

## 🎮 Features

- **Theme-based Daily Content**: Automatic theme rotation based on day number
- **Progressive Web App Design**: Mobile-first responsive design
- **Complete Game Flow**: Includes all necessary screens and modals
- **Fuzzy Matching System**: Built-in suggestion system for close answers
- **Results & Sharing**: Shareable results with progress bars
- **Review Mode**: Navigate through completed answers
- **Accessibility**: Proper keyboard navigation and screen reader support
- **Local Storage**: Persistent game state and progress tracking

## 📁 File Structure

```
ui-template/
├── template.html           # Main HTML template
├── template-styles.css     # Complete CSS framework
├── template-script.js      # JavaScript framework
├── README.md              # This documentation
├── implementation-guide.md # Step-by-step implementation guide
└── examples/              # Example implementations
    ├── faceguessr-example.js
    ├── wordgame-example.js
    └── numbergame-example.js
```

## 🚀 Quick Start

### 1. Copy Template Files
```bash
cp ui-template/* your-new-game/
```

### 2. Basic Implementation

Create your game class extending the template:

```javascript
// your-game.js
class YourGame extends DailyGameTemplate {
    constructor() {
        const themes = {
            1: {
                name: "Theme Name",
                items: [
                    {
                        name: "Answer",
                        alternativeNames: ["Alt Name"],
                        clue: "Your clue here",
                        contentData: "data-you-need"
                    }
                    // ... 4 more items
                ]
            }
        };

        const config = {
            gameName: "YourGame",
            gameType: "puzzle",
            launchDate: { year: 2025, month: 8, day: 3 },
            shareUrl: "https://yourdomain.com/yourgame/",
            shareTagline: "Your tagline here!"
        };

        super(themes, config);
    }

    renderGameContent(item, questionIndex) {
        // Your game-specific content rendering
        this.gameContent.innerHTML = `
            <div class="your-content">
                <!-- Render based on item.contentData -->
            </div>
        `;
    }

    checkAnswer(input, item) {
        // Your answer checking logic
        const normalizedInput = input.toLowerCase().trim();
        return item.alternativeNames.some(name => 
            name.toLowerCase() === normalizedInput
        );
    }

    findClosestMatch(input, item) {
        // Optional: Implement fuzzy matching
        // Use provided levenshteinDistance function
        return null; // or return closest match string
    }
}

// Initialize your game
document.addEventListener('DOMContentLoaded', () => {
    new YourGame();
});
```

### 3. Customize HTML Template

Update the placeholder values in `template.html`:

```html
<!-- Replace these placeholders: -->
{{GAME_TITLE}} → "YourGame"
{{GAME_TYPE}} → "puzzle"
{{DEFAULT_THEME}} → "Your Default Theme"
{{INPUT_PLACEHOLDER}} → "Enter your answer..."
{{SUBMIT_BUTTON_TEXT}} → "Submit Answer"
{{FOOTER_TEXT}} → "5 questions daily • Resets at midnight GMT"
{{RULES_INTRO_TEXT}} → "Brief description of your game"
{{RULE_1}} → "Your first rule"
<!-- ... etc -->
```

## 🎨 Customization Guide

### Theme Colors

The template uses CSS custom properties. Override in your CSS:

```css
:root {
    --primary-color: #6aaa64;      /* Success green */
    --error-color: #c5554d;        /* Error red */
    --background: #121213;         /* Dark background */
    --surface: #1a1a1b;          /* Card background */
    --border: #3a3a3c;           /* Border color */
    --text-primary: #ffffff;       /* Primary text */
    --text-secondary: #818384;     /* Secondary text */
}
```

### Game Content Area

The main content area (`.content-container`) is flexible:

```css
.content-container {
    /* Default: 280px × 280px */
    width: 280px;
    height: 280px;
    /* Customize as needed for your game */
}
```

### Typography

Using Wordle's font stack:
```css
font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
```

## 🔧 Advanced Features

### Fuzzy Matching Implementation

```javascript
findClosestMatch(input, item) {
    const normalizedInput = input.toLowerCase().trim();
    let bestMatch = null;
    let bestSimilarity = 0;
    
    item.alternativeNames.forEach(name => {
        const normalizedName = name.toLowerCase();
        const distance = levenshteinDistance(normalizedInput, normalizedName);
        const similarity = 1 - (distance / Math.max(normalizedInput.length, normalizedName.length));
        
        if (similarity > 0.7 && distance <= 3 && similarity > bestSimilarity) {
            bestMatch = name;
            bestSimilarity = similarity;
        }
    });
    
    return bestMatch;
}
```

### Custom Game Content Types

For different content types, override `renderGameContent`:

```javascript
// Image-based game
renderGameContent(item, questionIndex) {
    this.gameContent.innerHTML = `
        <img src="${item.contentData}" alt="Question ${questionIndex + 1}" 
             style="width: 100%; height: 100%; object-fit: cover;" />
    `;
}

// Text-based game  
renderGameContent(item, questionIndex) {
    this.gameContent.innerHTML = `
        <div class="text-content">
            <h3>${item.contentData.title}</h3>
            <p>${item.contentData.description}</p>
        </div>
    `;
}

// Audio-based game
renderGameContent(item, questionIndex) {
    this.gameContent.innerHTML = `
        <audio controls style="width: 100%;">
            <source src="${item.contentData}" type="audio/mpeg">
        </audio>
    `;
}
```

## 📱 Mobile Optimization

The template includes comprehensive mobile breakpoints:

- **Desktop**: > 600px width
- **Mobile**: ≤ 600px width  
- **Small Mobile**: ≤ 400px width

Key mobile optimizations:
- Responsive button layouts
- Optimized modal sizing
- Touch-friendly interactions
- Readable typography scaling

## 🎯 Game Types Examples

### Word-based Games
Perfect for games like:
- Word associations
- Definitions/synonyms
- Quote attributions
- Acronym expansions

### Image-based Games  
Ideal for:
- Face recognition (like FaceGuessr)
- Logo identification
- Landmark recognition
- Art/painting identification

### Audio-based Games
Great for:
- Music identification
- Voice recognition
- Sound effect games
- Audio quotes

### Hybrid Games
Combining multiple content types:
- Image + Audio clues
- Text + Image combinations
- Progressive revelation games

## 📊 Analytics Integration

Add analytics to track engagement:

```javascript
// Override methods to add tracking
processCorrectAnswer(input, item) {
    super.processCorrectAnswer(input, item);
    
    // Track correct answers
    gtag('event', 'correct_answer', {
        question_number: this.currentQuestionIndex + 1,
        theme: this.currentThemeName
    });
}

showResults() {
    super.showResults();
    
    // Track game completion
    gtag('event', 'game_complete', {
        score: this.score,
        theme: this.currentThemeName
    });
}
```

## 🔒 Security Considerations

- **Content Validation**: Validate all theme data
- **XSS Prevention**: Use `textContent` instead of `innerHTML` for user input
- **Rate Limiting**: Consider implementing client-side rate limiting
- **Data Sanitization**: Clean user input before processing

## 🚀 Deployment Checklist

- [ ] Replace all template placeholders
- [ ] Add your theme data
- [ ] Implement required abstract methods
- [ ] Test on mobile devices
- [ ] Verify sharing functionality
- [ ] Test localStorage persistence
- [ ] Validate accessibility
- [ ] Optimize images/assets
- [ ] Set up proper caching headers
- [ ] Configure analytics (optional)

## 🤝 Contributing

To improve this template:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Test across different games
5. Submit a pull request

## 📄 License

MIT License - Feel free to use this template for commercial or personal projects.

## 🆘 Support

For questions or issues:
- Check the implementation guide
- Review example implementations  
- Create an issue in the repository

---

**Happy game building!** 🎮✨