// Main-thread controller for running user code inside sandboxWorker.js with a hard timeout.
// A fresh worker is spun up per run so a timed-out (terminated) worker never leaks into the next run.

const TIMEOUT_MS = 4000;

export function runInSandbox({ code, functionName, type, tests, expectedOutput }) {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./sandboxWorker.js', import.meta.url), { type: 'module' });
    let settled = false;

    const finish = (payload) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(payload);
    };

    const timer = setTimeout(() => {
      finish({
        ok: false,
        timedOut: true,
        error: `Your code took longer than ${TIMEOUT_MS / 1000}s to run — check for an infinite loop.`,
      });
    }, TIMEOUT_MS);

    worker.onmessage = (e) => finish(e.data);
    worker.onerror = (e) => {
      finish({ ok: false, error: e.message || 'Unknown error while running your code.' });
    };

    worker.postMessage({ code, functionName, type, tests, expectedOutput });
  });
}
