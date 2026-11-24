/**
 * StudySync - Student Productivity Dashboard
 * Complete State Management, LocalStorage Persistence & Interactive Logic
 */

// ==========================================
// STATE MANAGEMENT & LOCALSTORAGE KEYS
// ==========================================
const STORAGE_KEYS = {
  USER_NAME: 'studysync_username',
  THEME: 'studysync_theme',
  TASKS: 'studysync_tasks',
  NOTES: 'studysync_notes',
  POMO_STATS: 'studysync_pomo_stats'
};

// Default seed data for initial visit
const DEFAULT_TASKS = [
  { id: '1', title: 'Complete Computer Networks Assignment 3', priority: 'high', category: 'assignment', completed: false, date: Date.now() - 3600000 },
  { id: '2', title: 'Read Chapter 5: Database Normalization', priority: 'medium', category: 'reading', completed: true, date: Date.now() - 7200000 },
  { id: '3', title: 'Prepare slides for Software Engineering sprint review', priority: 'high', category: 'project', completed: false, date: Date.now() - 10800000 },
  { id: '4', title: 'Review Calculus III practice problems', priority: 'low', category: 'exam', completed: false, date: Date.now() - 14400000 }
];

const DEFAULT_NOTES = [
  { id: '1', title: 'Git Merge Conflicts Cheat Sheet', body: '1. `git status` reveals conflicting files.\n2. Look for `<<<<<<< HEAD`, `=======`, and `>>>>>>>` markers.\n3. Decide which changes to keep, edit, and stage with `git add`.\n4. Run `git commit -m "Resolve merge conflict"` to finalize.', color: 'blue', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
  { id: '2', title: 'Distributed Systems Principles', body: 'CAP Theorem: Consistency, Availability, Partition Tolerance. A distributed network can only simultaneously provide two out of three guarantees.', color: 'purple', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
];

// App State
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || DEFAULT_TASKS;
let notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || DEFAULT_NOTES;
let currentFilter = 'all';
let pomodoroStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.POMO_STATS)) || { sessions: 2, totalMinutes: 50 };

// Timer State
let timerMode = 'work'; // 'work', 'short', 'long'
let timerDurations = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
let currentDuration = timerDurations[timerMode];
let timeRemaining = currentDuration;
let timerInterval = null;
let isTimerRunning = false;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 95; // r=95 => ~596.9

// ==========================================
// DOM ELEMENT SELECTORS
// ==========================================
const elements = {
  // Theme & Profile
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  displayName: document.getElementById('displayName'),
  sidebarUserName: document.getElementById('sidebarUserName'),
  avatarLetter: document.getElementById('avatarLetter'),
  nameModal: document.getElementById('nameModal'),
  studentNameInput: document.getElementById('studentNameInput'),
  saveNameForm: document.getElementById('saveNameForm'),
  closeNameModalBtn: document.getElementById('closeNameModalBtn'),
  cancelNameBtn: document.getElementById('cancelNameBtn'),
  greetingTime: document.getElementById('greetingTime'),
  currentDateDisplay: document.getElementById('currentDateDisplay'),
  liveClock: document.getElementById('liveClock'),

  // Sidebar & Navigation
  sidebar: document.getElementById('sidebar'),
  openSidebarBtn: document.getElementById('openSidebarBtn'),
  closeSidebarBtn: document.getElementById('closeSidebarBtn'),
  navItems: document.querySelectorAll('.nav-item'),
  pendingTaskBadge: document.getElementById('pendingTaskBadge'),

  // Tasks
  addTaskForm: document.getElementById('addTaskForm'),
  taskInput: document.getElementById('taskInput'),
  taskPriority: document.getElementById('taskPriority'),
  taskCategory: document.getElementById('taskCategory'),
  taskList: document.getElementById('taskList'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  emptyTasksState: document.getElementById('emptyTasksState'),

  // Metrics
  statsCompletedTasks: document.getElementById('statsCompletedTasks'),
  statsTaskPercent: document.getElementById('statsTaskPercent'),
  taskProgressBar: document.getElementById('taskProgressBar'),
  statsFocusMinutes: document.getElementById('statsFocusMinutes'),
  statsPomodoroCount: document.getElementById('statsPomodoroCount'),
  focusProgressBar: document.getElementById('focusProgressBar'),
  statsNotesCount: document.getElementById('statsNotesCount'),
  statsProductivityScore: document.getElementById('statsProductivityScore'),
  productivityProgressBar: document.getElementById('productivityProgressBar'),
  productivityLevel: document.getElementById('productivityLevel'),
  analyticsEfficiencyRate: document.getElementById('analyticsEfficiencyRate'),
  analyticsTotalHours: document.getElementById('analyticsTotalHours'),

  // Pomodoro
  timerTabs: document.querySelectorAll('.timer-tab'),
  timerTime: document.getElementById('timerTime'),
  timerCaption: document.getElementById('timerCaption'),
  timerStatusPill: document.getElementById('timerStatusPill'),
  timerProgressCircle: document.getElementById('timerProgressCircle'),
  timerStartBtn: document.getElementById('timerStartBtn'),
  timerPauseBtn: document.getElementById('timerPauseBtn'),
  timerResetBtn: document.getElementById('timerResetBtn'),
  timerSkipBtn: document.getElementById('timerSkipBtn'),
  completedSessionsCount: document.getElementById('completedSessionsCount'),

  // Notes
  toggleNoteFormBtn: document.getElementById('toggleNoteFormBtn'),
  noteComposer: document.getElementById('noteComposer'),
  addNoteForm: document.getElementById('addNoteForm'),
  noteTitleInput: document.getElementById('noteTitleInput'),
  noteBodyInput: document.getElementById('noteBodyInput'),
  cancelNoteBtn: document.getElementById('cancelNoteBtn'),
  notesGrid: document.getElementById('notesGrid'),
  emptyNotesState: document.getElementById('emptyNotesState'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUserProfile();
  initClock();
  renderTasks();
  renderNotes();
  initPomodoro();
  updateAnalytics();
  setupEventListeners();
});

// ==========================================
// THEME & PROFILE HANDLING
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'theme-dark';
  document.body.className = savedTheme;
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const isDark = document.body.classList.contains('theme-dark');
  const newTheme = isDark ? 'theme-light' : 'theme-dark';
  document.body.className = newTheme;
  localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  updateThemeIcon(newTheme);
  showToast(`Switched to ${isDark ? 'Light' : 'Dark'} mode`, 'info');
}

function updateThemeIcon(theme) {
  const icon = elements.themeToggleBtn.querySelector('i');
  if (theme === 'theme-light') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

function initUserProfile() {
  const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Alex';
  applyUserName(savedName);
}

function applyUserName(name) {
  elements.displayName.textContent = name;
  elements.sidebarUserName.textContent = name;
  elements.avatarLetter.textContent = name.charAt(0).toUpperCase();
}

function openNameModal() {
  elements.studentNameInput.value = elements.displayName.textContent;
  elements.nameModal.classList.add('active');
  elements.studentNameInput.focus();
}

function closeNameModal() {
  elements.nameModal.classList.remove('active');
}

// Clock & Time greeting
function initClock() {
  updateTimeDisplay();
  setInterval(updateTimeDisplay, 1000);
}

function updateTimeDisplay() {
  const now = new Date();
  const hours = now.getHours();
  
  // Greeting based on time
  let greeting = 'Good evening';
  if (hours < 12) greeting = 'Good morning';
  else if (hours < 17) greeting = 'Good afternoon';
  elements.greetingTime.textContent = greeting;

  // Live time string
  elements.liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  elements.currentDateDisplay.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// ==========================================
// TO-DO LIST FUNCTIONALITY
// ==========================================
function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  updateAnalytics();
}

function renderTasks() {
  elements.taskList.innerHTML = '';
  
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    elements.emptyTasksState.style.display = 'block';
  } else {
    elements.emptyTasksState.style.display = 'none';
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task done">
          <div class="task-content-details">
            <span class="task-title">${escapeHTML(task.title)}</span>
            <div class="task-tags">
              <span class="tag-badge priority-${task.priority}">${task.priority}</span>
              <span class="tag-badge category">${task.category}</span>
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="delete-task-btn" title="Delete Task" aria-label="Delete Task">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;

      // Event handlers for task items
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

      const deleteBtn = li.querySelector('.delete-task-btn');
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      elements.taskList.appendChild(li);
    });
  }

  // Update pending badge in sidebar
  const pendingCount = tasks.filter(t => !t.completed).length;
  elements.pendingTaskBadge.textContent = pendingCount;
}

function handleAddTask(e) {
  e.preventDefault();
  const title = elements.taskInput.value.trim();
  if (!title) return;

  const newTask = {
    id: Date.now().toString(),
    title: title,
    priority: elements.taskPriority.value,
    category: elements.taskCategory.value,
    completed: false,
    date: Date.now()
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  elements.taskInput.value = '';
  showToast('New study task added!', 'success');
}

function toggleTaskCompletion(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    showToast(task.completed ? 'Task marked as completed! 🎯' : 'Task restored to active list', 'info');
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  showToast('Task removed', 'warn');
}

function setTaskFilter(filter) {
  currentFilter = filter;
  elements.filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTasks();
}

// ==========================================
// POMODORO TIMER FUNCTIONALITY
// ==========================================
function initPomodoro() {
  setTimerMode('work');
  updateTimerUI();
  elements.completedSessionsCount.textContent = pomodoroStats.sessions;
}

function setTimerMode(mode) {
  timerMode = mode;
  pauseTimer();
  currentDuration = timerDurations[mode];
  timeRemaining = currentDuration;

  elements.timerTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  if (mode === 'work') {
    elements.timerStatusPill.textContent = 'Focus Session';
    elements.timerCaption.textContent = 'Deep Study Mode';
    elements.timerProgressCircle.style.stroke = 'var(--accent-primary)';
  } else if (mode === 'short') {
    elements.timerStatusPill.textContent = 'Short Break';
    elements.timerCaption.textContent = 'Rest & Hydrate';
    elements.timerProgressCircle.style.stroke = 'var(--accent-emerald)';
  } else {
    elements.timerStatusPill.textContent = 'Long Break';
    elements.timerCaption.textContent = 'Recharge & Stretch';
    elements.timerProgressCircle.style.stroke = 'var(--accent-amber)';
  }

  updateTimerUI();
}

function startTimer() {
  if (isTimerRunning) return;
  isTimerRunning = true;
  elements.timerStartBtn.style.display = 'none';
  elements.timerPauseBtn.style.display = 'inline-flex';

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerUI();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      handleTimerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isTimerRunning) return;
  clearInterval(timerInterval);
  isTimerRunning = false;
  elements.timerStartBtn.style.display = 'inline-flex';
  elements.timerPauseBtn.style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  timeRemaining = currentDuration;
  updateTimerUI();
  showToast('Timer reset', 'info');
}

function skipTimer() {
  pauseTimer();
  if (timerMode === 'work') {
    setTimerMode('short');
  } else {
    setTimerMode('work');
  }
  showToast('Switched to next interval', 'info');
}

function updateTimerUI() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  elements.timerTime.textContent = timeFormatted;

  // SVG circular progress calculation
  const progressRatio = (currentDuration - timeRemaining) / currentDuration;
  const offset = CIRCLE_CIRCUMFERENCE * (1 - progressRatio);
  elements.timerProgressCircle.style.strokeDashoffset = offset;
}

function handleTimerComplete() {
  playSyntheticChime();

  if (timerMode === 'work') {
    pomodoroStats.sessions += 1;
    pomodoroStats.totalMinutes += 25;
    localStorage.setItem(STORAGE_KEYS.POMO_STATS, JSON.stringify(pomodoroStats));
    elements.completedSessionsCount.textContent = pomodoroStats.sessions;
    updateAnalytics();
    showToast('🎉 Focus session completed! Great job! Time for a short break.', 'success');
    setTimerMode('short');
  } else {
    showToast('Break finished! Ready to dive back in?', 'info');
    setTimerMode('work');
  }
}

// Web Audio API Synthesizer (No external audio files required!)
function playSyntheticChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (err) {
    console.log('Audio notification played silently');
  }
}

// ==========================================
// STUDY NOTES FUNCTIONALITY
// ==========================================
function saveNotes() {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  updateAnalytics();
}

function renderNotes() {
  elements.notesGrid.innerHTML = '';

  if (notes.length === 0) {
    elements.emptyNotesState.style.display = 'block';
  } else {
    elements.emptyNotesState.style.display = 'none';
    notes.forEach(note => {
      const div = document.createElement('div');
      div.className = `note-card border-${note.color || 'blue'}`;
      div.innerHTML = `
        <div class="note-header">
          <span class="note-card-title">${escapeHTML(note.title)}</span>
          <button class="delete-note-btn" title="Delete Note" aria-label="Delete note">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <p class="note-body">${escapeHTML(note.body)}</p>
        <div class="note-footer">
          <span class="note-date"><i class="fa-regular fa-clock"></i> ${note.date}</span>
          <button class="copy-note-btn" title="Copy to clipboard">
            <i class="fa-regular fa-copy"></i> Copy
          </button>
        </div>
      `;

      // Handlers
      div.querySelector('.delete-note-btn').addEventListener('click', () => deleteNote(note.id));
      div.querySelector('.copy-note-btn').addEventListener('click', () => copyNoteContent(note.title, note.body));

      elements.notesGrid.appendChild(div);
    });
  }

  elements.statsNotesCount.textContent = notes.length;
}

function handleAddNote(e) {
  e.preventDefault();
  const title = elements.noteTitleInput.value.trim();
  const body = elements.noteBodyInput.value.trim();
  if (!title || !body) return;

  const colorRadio = document.querySelector('input[name="noteColor"]:checked');
  const color = colorRadio ? colorRadio.value : 'blue';

  const newNote = {
    id: Date.now().toString(),
    title: title,
    body: body,
    color: color,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  };

  notes.unshift(newNote);
  saveNotes();
  renderNotes();

  // Reset & close composer
  elements.noteTitleInput.value = '';
  elements.noteBodyInput.value = '';
  elements.noteComposer.classList.remove('active');
  showToast('Study note saved!', 'success');
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes();
  showToast('Note deleted', 'warn');
}

function copyNoteContent(title, body) {
  const fullText = `${title}\n\n${body}`;
  navigator.clipboard.writeText(fullText).then(() => {
    showToast('Note copied to clipboard!', 'info');
  }).catch(() => {
    showToast('Failed to copy text', 'warn');
  });
}

// ==========================================
// PROGRESS TRACKING & ANALYTICS
// ==========================================
function updateAnalytics() {
  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const taskPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Overview Cards
  elements.statsCompletedTasks.textContent = `${completedCount}/${totalTasks}`;
  elements.statsTaskPercent.textContent = `${taskPercent}% Done`;
  elements.taskProgressBar.style.width = `${taskPercent}%`;

  elements.statsFocusMinutes.textContent = `${pomodoroStats.totalMinutes} min`;
  elements.statsPomodoroCount.textContent = `${pomodoroStats.sessions} Sessions`;
  const focusTargetPercent = Math.min(100, Math.round((pomodoroStats.totalMinutes / 120) * 100));
  elements.focusProgressBar.style.width = `${focusTargetPercent}%`;

  elements.statsNotesCount.textContent = notes.length;

  // Productivity score calculation
  const score = Math.round((taskPercent * 0.6) + (Math.min(100, (pomodoroStats.sessions / 4) * 100) * 0.4));
  elements.statsProductivityScore.textContent = `${score}%`;
  elements.productivityProgressBar.style.width = `${score}%`;

  if (score >= 80) {
    elements.productivityLevel.textContent = 'Peak Scholar';
    elements.productivityLevel.className = 'metric-trend text-green';
  } else if (score >= 50) {
    elements.productivityLevel.textContent = 'Steady Progress';
    elements.productivityLevel.className = 'metric-trend text-purple';
  } else {
    elements.productivityLevel.textContent = 'Getting Started';
    elements.productivityLevel.className = 'metric-trend text-amber';
  }

  // Analytics widget breakdown
  elements.analyticsEfficiencyRate.textContent = `${taskPercent}%`;
  const hoursDone = (pomodoroStats.totalMinutes / 60).toFixed(1);
  elements.analyticsTotalHours.textContent = `${hoursDone} / 4.0 hrs`;
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-solid fa-circle-info';
  if (type === 'success') icon = 'fa-solid fa-circle-check';
  if (type === 'warn') icon = 'fa-solid fa-triangle-exclamation';

  toast.innerHTML = `<i class="${icon}"></i> <span>${escapeHTML(message)}</span>`;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Utility: HTML escape
function escapeHTML(str) {
  const p = document.createElement('p');
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

// ==========================================
// EVENT LISTENERS CONFIGURATION
// ==========================================
function setupEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Student Profile Modal
  elements.displayName.addEventListener('click', openNameModal);
  elements.closeNameModalBtn.addEventListener('click', closeNameModal);
  elements.cancelNameBtn.addEventListener('click', closeNameModal);
  elements.saveNameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = elements.studentNameInput.value.trim();
    if (newName) {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, newName);
      applyUserName(newName);
      closeNameModal();
      showToast(`Profile name updated to ${newName}!`, 'success');
    }
  });

  // Sidebar Mobile Toggle
  elements.openSidebarBtn.addEventListener('click', () => {
    elements.sidebar.classList.add('mobile-open');
  });

  elements.closeSidebarBtn.addEventListener('click', () => {
    elements.sidebar.classList.remove('mobile-open');
  });

  // Navigation Items
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
      elements.navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const target = item.dataset.target;
      elements.sidebar.classList.remove('mobile-open');

      // Scroll to specific section
      if (target === 'tasks-section') {
        document.getElementById('tasksSectionWrapper').scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'pomodoro-section') {
        document.getElementById('pomodoroSectionWrapper').scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'notes-section') {
        document.getElementById('notesSectionWrapper').scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'analytics-section') {
        document.getElementById('analyticsSectionWrapper').scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Tasks Form & Filters
  elements.addTaskForm.addEventListener('submit', handleAddTask);
  elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setTaskFilter(btn.dataset.filter));
  });

  // Pomodoro Controls
  elements.timerTabs.forEach(tab => {
    tab.addEventListener('click', () => setTimerMode(tab.dataset.mode));
  });
  elements.timerStartBtn.addEventListener('click', startTimer);
  elements.timerPauseBtn.addEventListener('click', pauseTimer);
  elements.timerResetBtn.addEventListener('click', resetTimer);
  elements.timerSkipBtn.addEventListener('click', skipTimer);

  // Notes Form
  elements.toggleNoteFormBtn.addEventListener('click', () => {
    elements.noteComposer.classList.toggle('active');
    if (elements.noteComposer.classList.contains('active')) {
      elements.noteTitleInput.focus();
    }
  });
  elements.cancelNoteBtn.addEventListener('click', () => {
    elements.noteComposer.classList.remove('active');
  });
  elements.addNoteForm.addEventListener('submit', handleAddNote);
}
