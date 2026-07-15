import { WORLDS, getAllLevels } from './curriculum.js';

const STORAGE_KEY = 'codeforge:save:v1';

const BADGE_DEFS = [
  { id: 'first-steps', name: 'First Steps', icon: '🌱', desc: 'Complete your first level.' },
  { id: 'loop-master', name: 'Loop Master', icon: '🔁', desc: 'Finish the Control Flow world.' },
  { id: 'function-wizard', name: 'Function Wizard', icon: '🪄', desc: 'Finish the Functions world.' },
  { id: 'data-wrangler', name: 'Data Wrangler', icon: '🗃️', desc: 'Finish the Data Structures world.' },
  { id: 'algorithm-ace', name: 'Algorithm Ace', icon: '⚡', desc: 'Finish the Algorithms world.' },
  { id: 'async-adept', name: 'Async Adept', icon: '🌀', desc: 'Finish the Advanced JS world.' },
  { id: 'ai-pioneer', name: 'AI Pioneer', icon: '🤖', desc: 'Finish the Building Blocks of AI capstone.' },
  { id: 'no-hints', name: 'Self-Reliant', icon: '🧠', desc: 'Complete 5 levels without using a hint.' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '💎', desc: 'Pass 10 levels on your very first submit.' },
  { id: 'speed-runner', name: 'Speed Runner', icon: '🏃', desc: 'Complete a level in under 45 seconds.' },
  { id: 'centurion', name: 'Centurion', icon: '🏆', desc: 'Earn 1000 total XP.' },
  { id: 'streak-3', name: 'On a Roll', icon: '🔥', desc: 'Keep a 3-day streak going.' },
  { id: 'master-coder', name: 'Master Coder', icon: '👑', desc: 'Complete every level in CodeForge.' },
];

function defaultState() {
  return {
    xp: 0,
    completedLevels: {}, // id -> { xp, usedHint, firstTry, seconds, completedAt }
    badges: [],
    streak: 0,
    lastActiveDate: null,
    hintsUsedCount: 0,
    noHintCompletions: 0,
    firstTryCompletions: 0,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(state) {
  const today = todayStr();
  if (state.lastActiveDate === today) return state.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  state.lastActiveDate = today;
  state.streak = newStreak;
  return newStreak;
}

/**
 * Records a level completion, updates XP/streak/badge counters, persists, and
 * returns { newlyEarnedBadges, leveledUp: bool, xpAwarded }.
 */
export function completeLevel(state, level, { usedHint, firstTry, seconds }) {
  const alreadyDone = !!state.completedLevels[level.id];
  updateStreak(state);

  let xpAwarded = 0;
  if (!alreadyDone) {
    xpAwarded = level.xp;
    state.xp += xpAwarded;
    state.completedLevels[level.id] = {
      xp: level.xp,
      usedHint: !!usedHint,
      firstTry: !!firstTry,
      seconds: seconds || null,
      completedAt: Date.now(),
    };
    if (!usedHint) state.noHintCompletions++;
    if (firstTry) state.firstTryCompletions++;
  }

  const newlyEarnedBadges = evaluateBadges(state, { seconds });
  saveState(state);
  return { newlyEarnedBadges, xpAwarded, alreadyDone };
}

export function recordHintUsed(state) {
  state.hintsUsedCount++;
  saveState(state);
}

function evaluateBadges(state, { seconds } = {}) {
  const earned = new Set(state.badges);
  const newly = [];
  const completedCount = Object.keys(state.completedLevels).length;

  const maybeAward = (id) => {
    if (!earned.has(id)) {
      earned.add(id);
      newly.push(BADGE_DEFS.find((b) => b.id === id));
    }
  };

  if (completedCount >= 1) maybeAward('first-steps');
  if (state.xp >= 1000) maybeAward('centurion');
  if (state.noHintCompletions >= 5) maybeAward('no-hints');
  if (state.firstTryCompletions >= 10) maybeAward('perfectionist');
  if (seconds != null && seconds < 45) maybeAward('speed-runner');
  if (state.streak >= 3) maybeAward('streak-3');

  const worldBadgeMap = {
    w2: 'loop-master',
    w3: 'function-wizard',
    w4: 'data-wrangler',
    w5: 'algorithm-ace',
    w6: 'async-adept',
    w7: 'ai-pioneer',
  };
  for (const world of WORLDS) {
    const badgeId = worldBadgeMap[world.id];
    if (!badgeId) continue;
    const allDone = world.levels.every((l) => state.completedLevels[l.id]);
    if (allDone) maybeAward(badgeId);
  }

  const allLevels = getAllLevels();
  if (allLevels.every((l) => state.completedLevels[l.id])) maybeAward('master-coder');

  state.badges = [...earned];
  return newly;
}

export function getBadgeDefs() {
  return BADGE_DEFS;
}

/** Fraction (0-1) of a world's levels completed. */
export function worldProgress(world, state) {
  const done = world.levels.filter((l) => state.completedLevels[l.id]).length;
  return done / world.levels.length;
}

/** A world is unlocked if it's the first world, or the previous world has hit its unlock threshold. */
export function isWorldUnlocked(worldIndex, state) {
  if (worldIndex === 0) return true;
  const world = WORLDS[worldIndex];
  const prevWorld = WORLDS[worldIndex - 1];
  return worldProgress(prevWorld, state) >= world.unlockAt;
}

export function totalXp(state) {
  return state.xp;
}

export function xpForNextMilestone(xp) {
  const milestone = Math.ceil((xp + 1) / 250) * 250;
  return milestone;
}
