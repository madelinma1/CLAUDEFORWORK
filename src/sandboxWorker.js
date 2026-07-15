// Runs untrusted user code in an isolated Worker (separate global scope, no DOM access).
// The main thread enforces a wall-clock timeout by terminating the worker outright,
// since a Worker cannot be "interrupted" mid-loop from the inside.

self.onmessage = async function (e) {
  const { code, functionName, type, tests, expectedOutput } = e.data;
  const logs = [];

  const fakeConsole = {
    log: (...args) => logs.push(args.map(stringifyLogArg).join(' ')),
  };

  try {
    if (type === 'output') {
      const runner = new Function('console', code);
      runner(fakeConsole);
      const pass = arraysEqual(logs, expectedOutput || []);
      self.postMessage({ ok: true, type: 'output', pass, logs, expectedOutput });
      return;
    }

    // type === 'function'
    const factory = new Function(`${code}\nreturn ${functionName};`);
    const fn = factory();

    const results = [];
    for (const test of tests) {
      try {
        const result = await runFunctionTest(fn, test);
        const pass = deepEqual(result, test.expected);
        results.push({ desc: test.desc, pass, actual: result, expected: test.expected });
      } catch (err) {
        results.push({ desc: test.desc, pass: false, error: err.message, expected: test.expected });
      }
    }
    self.postMessage({ ok: true, type: 'function', results, logs });
  } catch (err) {
    self.postMessage({ ok: false, error: err.message, logs });
  }
};

async function runFunctionTest(fn, test) {
  const args = (test.argsSource || test.args || []).map((a) =>
    typeof a === 'string' && test.argsSource ? new Function(`return (${a});`)() : a
  );

  switch (test.mode) {
    case 'counterSequence': {
      const counter = fn(...args);
      return [counter(), counter(), counter()];
    }
    case 'bankSequence': {
      const acc = fn(...args);
      return [acc.deposit(50), acc.withdraw(20), acc.getBalance()];
    }
    case 'composeCall': {
      const composed = fn(...args);
      return composed(test.callArg);
    }
    default:
      if (test.async) {
        return await fn(...args);
      }
      return fn(...args);
  }
}

function stringifyLogArg(arg) {
  if (typeof arg === 'string') return arg;
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-9;
  }
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}
