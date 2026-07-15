import { WORLDS, getLevelById } from './curriculum.js';
import {
  loadState,
  completeLevel,
  recordHintUsed,
  worldProgress,
  isWorldUnlocked,
  getBadgeDefs,
  resetState,
} from './engine.js';
import { createEditor } from './editor.js';
import { runInSandbox } from './sandbox.js';

let state = loadState();
let root = null;
let toastTimer = null;

export function mountApp(rootEl) {
  root = rootEl;
  renderShell();
  goToMap();
}

function renderShell() {
  root.innerHTML = `
    <div class="app-header">
      <div class="brand">
        <span class="brand-mark">&lt;/&gt;</span>
        <span class="brand-name">CodeForge</span>
      </div>
      <div class="header-stats">
        <div class="streak" title="Daily streak">🔥 <span id="streak-count">0</span></div>
        <div class="xp-pill" title="Total XP">⭐ <span id="xp-count">0</span> XP</div>
        <button class="badges-btn" id="badges-btn">🏅 Badges</button>
        <button class="reset-btn" id="reset-btn" title="Reset all progress">Reset</button>
      </div>
    </div>
    <div class="app-body" id="app-body"></div>
    <div class="toast-stack" id="toast-stack"></div>
    <div class="modal-overlay" id="modal-overlay" hidden></div>
  `;

  document.getElementById('badges-btn').addEventListener('click', showBadgesModal);
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      state = resetState();
      goToMap();
    }
  });

  updateHeaderStats();
}

function updateHeaderStats() {
  document.getElementById('streak-count').textContent = state.streak;
  document.getElementById('xp-count').textContent = state.xp;
}

// ---------- Map view ----------

function goToMap() {
  const body = document.getElementById('app-body');
  body.innerHTML = `<div class="map-view" id="map-view"></div>`;
  const mapView = document.getElementById('map-view');

  WORLDS.forEach((world, index) => {
    const unlocked = isWorldUnlocked(index, state);
    const progress = worldProgress(world, state);
    const section = document.createElement('section');
    section.className = `world-section theme-${world.theme} ${unlocked ? '' : 'world-locked'}`;

    const nodesHtml = world.levels
      .map((level, i) => {
        const done = !!state.completedLevels[level.id];
        const nodeState = !unlocked ? 'locked' : done ? 'completed' : 'available';
        const sideClass = i % 2 === 0 ? 'side-left' : 'side-right';
        return `
          <button class="level-node ${nodeState} ${sideClass}" data-level-id="${level.id}" ${nodeState === 'locked' ? 'disabled' : ''}>
            <span class="node-icon">${nodeState === 'completed' ? '✓' : nodeState === 'locked' ? '🔒' : i + 1}</span>
            <span class="node-title">${level.title}</span>
            <span class="node-xp">${level.xp} XP</span>
          </button>
        `;
      })
      .join('<div class="node-connector"></div>');

    section.innerHTML = `
      <div class="world-header">
        <h2>${world.name}</h2>
        <p class="world-tagline">${world.tagline}</p>
        <div class="world-progress-bar"><div class="world-progress-fill" style="width:${Math.round(progress * 100)}%"></div></div>
        ${!unlocked ? '<p class="world-lock-msg">Complete more of the previous world to unlock.</p>' : ''}
      </div>
      <div class="level-path">${nodesHtml}</div>
    `;
    mapView.appendChild(section);
  });

  mapView.querySelectorAll('.level-node:not(.locked)').forEach((btn) => {
    btn.addEventListener('click', () => openLevel(btn.dataset.levelId));
  });
}

// ---------- Challenge view ----------

let currentEditor = null;
let currentLevel = null;
let attempts = 0;
let levelStartTime = 0;
let selectedPredictIndex = null;

function openLevel(levelId) {
  currentLevel = getLevelById(levelId);
  attempts = 0;
  levelStartTime = Date.now();
  selectedPredictIndex = null;
  renderChallenge();
}

function renderChallenge() {
  const body = document.getElementById('app-body');
  const level = currentLevel;
  const alreadyDone = !!state.completedLevels[level.id];

  body.innerHTML = `
    <div class="challenge-view">
      <div class="challenge-top">
        <button class="back-btn" id="back-btn">&larr; Map</button>
        <div class="challenge-heading">
          <span class="challenge-world">${level.worldName}</span>
          <h1>${level.title} ${alreadyDone ? '<span class="done-badge">✓ Done</span>' : ''}</h1>
          <span class="concept-tag">${level.concept}</span>
        </div>
        <div class="challenge-xp">+${level.xp} XP</div>
      </div>
      <div class="challenge-columns">
        <div class="lesson-panel">
          ${level.lesson}
          <div class="hint-section" id="hint-section"></div>
        </div>
        <div class="workspace-panel" id="workspace-panel"></div>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', goToMap);
  renderHints();

  if (level.type === 'predict') {
    renderPredictWorkspace();
  } else {
    renderCodeWorkspace();
  }
}

function renderHints() {
  const hintSection = document.getElementById('hint-section');
  const level = currentLevel;
  if (!level.hints || level.hints.length === 0) {
    hintSection.innerHTML = '';
    return;
  }
  const revealed = hintSection.dataset.revealed ? parseInt(hintSection.dataset.revealed, 10) : 0;
  hintSection.dataset.revealed = revealed;

  hintSection.innerHTML = `
    <div class="hint-list">
      ${level.hints
        .slice(0, revealed)
        .map((h, i) => `<div class="hint-item"><strong>Hint ${i + 1}:</strong> ${h}</div>`)
        .join('')}
    </div>
    ${
      revealed < level.hints.length
        ? `<button class="hint-btn" id="hint-btn">💡 Show Hint (${revealed + 1}/${level.hints.length})</button>`
        : ''
    }
  `;

  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      recordHintUsed(state);
      hintSection.dataset.revealed = revealed + 1;
      renderHints();
    });
  }
}

function hintsWereUsed() {
  const hintSection = document.getElementById('hint-section');
  return hintSection && parseInt(hintSection.dataset.revealed || '0', 10) > 0;
}

// ---- predict-type workspace ----

function renderPredictWorkspace() {
  const panel = document.getElementById('workspace-panel');
  const level = currentLevel;
  panel.innerHTML = `
    <pre class="predict-code"><code>${escapeHtml(level.code)}</code></pre>
    <div class="predict-options" id="predict-options">
      ${level.options
        .map((opt, i) => `<button class="predict-option" data-index="${i}">${escapeHtml(opt)}</button>`)
        .join('')}
    </div>
    <button class="submit-btn" id="predict-submit">Submit Answer</button>
    <div class="result-area" id="result-area"></div>
  `;

  const optionButtons = [...panel.querySelectorAll('.predict-option')];
  optionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      optionButtons.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedPredictIndex = parseInt(btn.dataset.index, 10);
    });
  });

  document.getElementById('predict-submit').addEventListener('click', () => {
    if (selectedPredictIndex === null) return;
    attempts++;
    const correct = selectedPredictIndex === level.correctIndex;
    optionButtons.forEach((b, i) => {
      b.classList.remove('selected');
      if (i === level.correctIndex) b.classList.add('correct');
      else if (i === selectedPredictIndex && !correct) b.classList.add('incorrect');
      b.disabled = true;
    });

    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = `
      <div class="result-banner ${correct ? 'pass' : 'fail'}">
        ${correct ? '✅ Correct!' : '❌ Not quite.'}
      </div>
      <p class="explanation">${level.explanation}</p>
      ${correct ? '<div id="completion-slot"></div>' : `<button class="retry-btn" id="retry-btn">Try Again</button>`}
    `;

    if (correct) {
      handleLevelPassed(document.getElementById('completion-slot'));
    } else {
      document.getElementById('retry-btn').addEventListener('click', renderPredictWorkspace);
    }
  });
}

// ---- code-type workspace (function / output) ----

function renderCodeWorkspace() {
  const panel = document.getElementById('workspace-panel');
  const level = currentLevel;
  const saved = state.completedLevels[level.id];

  panel.innerHTML = `
    <div class="editor-toolbar">
      <button class="run-btn" id="run-btn">▶ Run Tests</button>
      <button class="solution-btn" id="solution-btn">Show Solution</button>
    </div>
    <div class="editor-container" id="editor-container"></div>
    <div class="result-area" id="result-area"></div>
  `;

  currentEditor = createEditor(document.getElementById('editor-container'), {
    initialCode: level.starter,
  });

  document.getElementById('solution-btn').addEventListener('click', () => {
    if (confirm('Reveal the full solution? You can still learn more by trying first!')) {
      currentEditor.setValue(level.solution);
    }
  });

  document.getElementById('run-btn').addEventListener('click', runCurrentCode);
}

async function runCurrentCode() {
  const level = currentLevel;
  const runBtn = document.getElementById('run-btn');
  const resultArea = document.getElementById('result-area');
  runBtn.disabled = true;
  runBtn.textContent = 'Running…';
  resultArea.innerHTML = '';

  const code = currentEditor.getValue();
  const payload =
    level.type === 'output'
      ? { code, type: 'output', expectedOutput: level.expectedOutput }
      : { code, type: 'function', functionName: level.functionName, tests: level.tests };

  const outcome = await runInSandbox(payload);
  attempts++;
  runBtn.disabled = false;
  runBtn.textContent = '▶ Run Tests';

  if (!outcome.ok) {
    resultArea.innerHTML = `
      <div class="result-banner fail">❌ ${outcome.timedOut ? 'Timed out' : 'Error'}</div>
      <pre class="error-output">${escapeHtml(outcome.error || 'Unknown error')}</pre>
    `;
    return;
  }

  if (outcome.type === 'output') {
    const pass = outcome.pass;
    resultArea.innerHTML = `
      <div class="result-banner ${pass ? 'pass' : 'fail'}">${pass ? '✅ All output matches!' : '❌ Output does not match yet'}</div>
      <div class="output-compare">
        <div><strong>Your output:</strong><pre>${escapeHtml(outcome.logs.join('\n') || '(nothing printed)')}</pre></div>
        <div><strong>Expected:</strong><pre>${escapeHtml((level.expectedOutput || []).join('\n'))}</pre></div>
      </div>
      ${pass ? '<div id="completion-slot"></div>' : ''}
    `;
    if (pass) handleLevelPassed(document.getElementById('completion-slot'));
    return;
  }

  const allPass = outcome.results.every((r) => r.pass);
  resultArea.innerHTML = `
    <div class="result-banner ${allPass ? 'pass' : 'fail'}">
      ${allPass ? '✅ All tests passed!' : `${outcome.results.filter((r) => r.pass).length}/${outcome.results.length} tests passed`}
    </div>
    <ul class="test-results">
      ${outcome.results
        .map(
          (r) => `
        <li class="test-result ${r.pass ? 'pass' : 'fail'}">
          <span class="test-icon">${r.pass ? '✓' : '✗'}</span>
          <span class="test-desc">${escapeHtml(r.desc)}</span>
          ${!r.pass ? `<span class="test-detail">got <code>${escapeHtml(safeJson(r.actual ?? r.error))}</code>, expected <code>${escapeHtml(safeJson(r.expected))}</code></span>` : ''}
        </li>`
        )
        .join('')}
    </ul>
    ${allPass ? '<div id="completion-slot"></div>' : ''}
  `;
  if (allPass) handleLevelPassed(document.getElementById('completion-slot'));
}

function handleLevelPassed(slotEl) {
  const level = currentLevel;
  const seconds = Math.round((Date.now() - levelStartTime) / 1000);
  const firstTry = attempts === 1;
  const usedHint = hintsWereUsed();

  const { newlyEarnedBadges, xpAwarded, alreadyDone } = completeLevel(state, level, {
    usedHint,
    firstTry,
    seconds,
  });
  updateHeaderStats();

  if (slotEl) {
    slotEl.innerHTML = `
      <div class="completion-panel">
        ${alreadyDone ? '<p>Already completed — nice review!</p>' : `<p>+${xpAwarded} XP earned!</p>`}
        <button class="next-btn" id="next-level-btn">Continue &rarr;</button>
      </div>
    `;
    document.getElementById('next-level-btn').addEventListener('click', goToMap);
  }

  newlyEarnedBadges.forEach((badge) => showToast(`${badge.icon} Badge unlocked: ${badge.name}`));
}

// ---------- Badges modal ----------

function showBadgesModal() {
  const overlay = document.getElementById('modal-overlay');
  const earned = new Set(state.badges);
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>Badges</h2>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <div class="badge-grid">
        ${getBadgeDefs()
          .map(
            (b) => `
          <div class="badge-card ${earned.has(b.id) ? 'earned' : 'locked'}">
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.desc}</div>
          </div>`
          )
          .join('')}
      </div>
    </div>
  `;
  overlay.hidden = false;
  document.getElementById('modal-close').addEventListener('click', () => {
    overlay.hidden = true;
    overlay.innerHTML = '';
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.hidden = true;
      overlay.innerHTML = '';
    }
  });
}

// ---------- Toasts ----------

function showToast(message) {
  const stack = document.getElementById('toast-stack');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-visible'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

// ---------- helpers ----------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function safeJson(v) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
