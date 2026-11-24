# 🎓 StudySync - Student Productivity Dashboard

> A sleek, high-performance, and responsive single-page productivity dashboard engineered for modern students. Features an integrated To-Do task manager, Pomodoro study timer, quick lecture notes scratchpad, and real-time productivity analytics—all persisting seamlessly in LocalStorage without any backend requirement.

---

## 🚀 Live Demo & Project Overview

**StudySync** is tailored to keep students focused, organized, and accountable. Built entirely using vanilla modern web technologies (**HTML5**, **CSS3**, and **ES6+ JavaScript**), it provides instantaneous feedback, zero latency, and 100% offline-first reliability.

### Key Features
1. **Interactive Sidebar & Navigation:** Quick navigation between Dashboard, Tasks, Pomodoro, Notes, and Progress analytics with mobile hamburger drawer support.
2. **Personalized Welcome Hero:** Dynamic greeting based on time of day (Morning/Afternoon/Evening), live ticking clock, daily motivational quote, and clickable student name customization with instant LocalStorage sync.
3. **To-Do List Manager:**
   - Add tasks with priority levels (*High*, *Medium*, *Low*) and categories (*Assignment*, *Exam*, *Reading*, *Project*).
   - Filter tasks by status: **All**, **Active**, and **Done**.
   - One-click completion toggle with visual strikethrough and pending task badge counter.
   - Delete task support with toast alerts.
4. **Custom Pomodoro Timer:**
   - 25-minute Deep Focus sessions, 5-minute Short Breaks, and 15-minute Long Breaks.
   - Animated SVG circular progress ring that dynamically updates second-by-second.
   - Synthesized audio notification chime powered by the **Web Audio API** (no external audio files or broken assets).
   - Completed session counter and focus minutes tracker.
5. **Quick Study Notes:**
   - Add notes with customizable color codes (*Blue*, *Purple*, *Green*, *Amber*, *Rose*).
   - Instant copy-to-clipboard button and delete controls.
   - Preserved across browser refreshes.
6. **Progress Tracking & Analytics:**
   - Task completion efficiency rate indicator.
   - Focus time tracker and productivity health score.
   - Responsive weekly activity breakdown visualization.
7. **Dark / Light Theme Toggle:**
   - One-click toggle between dark and light themes, preserved across sessions via LocalStorage.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic markup, accessible labels, and responsive meta tags.
- **CSS3:** Custom CSS variables design system, modern gradients, glassmorphism, responsive CSS Grid & Flexbox, smooth transitions and SVG animation.
- **JavaScript (ES6+):** Pure Vanilla JavaScript, DOM manipulation, Web Audio API synthesis, modular event handlers, and LocalStorage state persistence.
- **Font Awesome 6 & Google Fonts (Plus Jakarta Sans):** Vector icons and clean modern typography.

---

## 📂 Project Structure

```text
ques1/
├── index.html        # Main dashboard markup and semantic structure
├── style.css         # Responsive styling, design tokens, and theme system
├── script.js         # Core application logic, LocalStorage sync, and timer
├── README.md         # Comprehensive project documentation & Git guide
└── .gitignore        # Standard Git exclusions for clean repository tracking
```

---

## 💻 Getting Started Locally

No complex dependencies, Node.js packages, or compilation steps required!

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```
2. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari):
   - Double click `index.html`, OR
   - Right click `index.html` -> **Open with** -> Browser of your choice, OR
   - Serve using VS Code's **Live Server** extension.

---

## 🤝 College Assignment: Intentional Git Merge Conflict Demonstration

This project was built to demonstrate core version control concepts in **Git & GitHub**, specifically showcasing branching, commit workflows, creating an intentional merge conflict, and safely resolving it.

### Step-by-Step Merge Conflict Walkthrough

#### 1. Initialize Git and make the initial commit
```bash
git init
git add .
git commit -m "Initial commit: Complete Student Productivity Dashboard"
```

#### 2. Create and switch to a feature branch (e.g., `feature-quote-update`)
```bash
git checkout -b feature-quote-update
```
Edit line 105 in `index.html` (the motivational quote) to:
```html
<p class="quote-text" id="dailyQuote">"Discipline equals freedom. Focus on your goals today!"</p>
```
Commit the change on this branch:
```bash
git add index.html
git commit -m "Update daily motivational quote to discipline quote"
```

#### 3. Switch back to `main` and make a conflicting edit on the same line
```bash
git checkout main
```
Edit the exact same line 105 in `index.html` to a different quote:
```html
<p class="quote-text" id="dailyQuote">"Knowledge is power. Study smart, stay persistent!"</p>
```
Commit this change on `main`:
```bash
git add index.html
git commit -m "Update daily motivational quote to knowledge quote"
```

#### 4. Trigger the intentional merge conflict
Attempt to merge the feature branch into `main`:
```bash
git merge feature-quote-update
```
Git will output:
```text
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

#### 5. Inspect and resolve the conflict
Open `index.html` in your editor. You will see Git's conflict markers:
```html
<<<<<<< HEAD
<p class="quote-text" id="dailyQuote">"Knowledge is power. Study smart, stay persistent!"</p>
=======
<p class="quote-text" id="dailyQuote">"Discipline equals freedom. Focus on your goals today!"</p>
>>>>>>> feature-quote-update
```
Resolve the conflict by choosing the best quote (or combining them) and deleting the markers `<<<<<<<`, `=======`, and `>>>>>>>`:
```html
<p class="quote-text" id="dailyQuote">"Discipline equals freedom. Study smart and stay persistent!"</p>
```

#### 6. Finalize the merge
```bash
git add index.html
git commit -m "Merge branch 'feature-quote-update': resolved quote conflict"
```

#### 7. Verify git log graph
```bash
git log --oneline --graph --all
```
Both branch histories are now successfully united!

---

## 📄 License
This project is open-source under the MIT License for academic and educational learning.
