# Daily Game UI Template Reference

## 📍 Template Location
The reusable Daily Game UI Template is located at:
```
/Applications/XAMPP/xamppfiles/htdocs/Faceguessr/ui-template/
```

## 📁 Template Files
- `template.html` - Complete HTML structure
- `template-styles.css` - Full CSS framework  
- `template-script.js` - JavaScript framework
- `README.md` - Documentation
- `implementation-guide.md` - Step-by-step guide
- `faceguessr-example.js` - Real implementation example

## 🎯 Usage for New Games
When creating new daily games, reference this template for:
- Complete UI structure and styling
- Game logic framework (extend DailyGameTemplate class)
- Theme-based content management
- Mobile responsive design
- Results and sharing functionality
- Review system navigation
- Modal components (rules, results, suggestions)

## 🔧 Key Implementation Pattern
```javascript
class YourGame extends DailyGameTemplate {
    constructor() {
        super(THEMES, CONFIG);
    }
    
    renderGameContent(item, questionIndex) {
        // Your content rendering logic
    }
    
    checkAnswer(input, item) {
        // Your answer validation logic
    }
    
    findClosestMatch(input, item) {
        // Optional: fuzzy matching logic
    }
}
```

## 📋 Quick Setup Process
1. Copy template files to new project
2. Update configuration object
3. Define themes data structure
4. Implement the 3 abstract methods
5. Customize HTML placeholders
6. Add game-specific CSS if needed

## 🎨 Design System
- **Colors**: Dark theme (#121213 background, #6aaa64 accent)
- **Typography**: "Clear Sans", "Helvetica Neue", Arial
- **Layout**: Mobile-first responsive (600px, 400px breakpoints)
- **Components**: Buttons, modals, progress bars, feedback system
- **Animations**: Shake feedback, progress fills, modal slides

## 📱 Mobile Optimization
All components are fully responsive with:
- Touch-friendly button sizes
- Optimized modal sizing
- Readable typography scaling
- Proper spacing on small screens

---
**Template created**: $(date)
**Based on**: FaceGuessr v1.0
**Compatible with**: All modern browsers, mobile devices