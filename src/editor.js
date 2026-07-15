// Zero-dependency code editor: a transparent <textarea> stacked exactly on top of a
// syntax-highlighted <pre><code>, kept in sync on every keystroke and scroll event.

const KEYWORDS =
  '\\b(?:const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|' +
  'class|extends|new|this|typeof|instanceof|in|of|try|catch|finally|throw|async|await|yield|' +
  'import|export|from|as|null|undefined|true|false|void|delete|static|get|set|super)\\b';

const TOKEN_REGEX = new RegExp(
  [
    '(//.*$)', // 1: line comment
    '(/\\*[\\s\\S]*?\\*/)', // 2: block comment
    '(`(?:\\\\.|[^`\\\\])*`)', // 3: template literal
    '("(?:\\\\.|[^"\\\\])*")', // 4: double-quoted string
    "('(?:\\\\.|[^'\\\\])*')", // 5: single-quoted string
    `(${KEYWORDS})`, // 6: keyword
    '(\\b\\d+(?:\\.\\d+)?\\b)', // 7: number
  ].join('|'),
  'gm'
);

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(code) {
  const escaped = escapeHtml(code);
  return escaped.replace(TOKEN_REGEX, (match, comment1, comment2, template, dstr, sstr, keyword, number) => {
    if (comment1 || comment2) return `<span class="tok-comment">${match}</span>`;
    if (template) return `<span class="tok-string">${match}</span>`;
    if (dstr || sstr) return `<span class="tok-string">${match}</span>`;
    if (keyword) return `<span class="tok-keyword">${match}</span>`;
    if (number) return `<span class="tok-number">${match}</span>`;
    return match;
  });
}

/**
 * Mounts a code editor into `container`. Returns { getValue, setValue, focus, destroy }.
 */
export function createEditor(container, { initialCode = '', onChange } = {}) {
  container.classList.add('code-editor');
  container.innerHTML = `
    <pre class="code-editor-highlight" aria-hidden="true"><code></code></pre>
    <textarea class="code-editor-input" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
  `;

  const pre = container.querySelector('.code-editor-highlight');
  const code = pre.querySelector('code');
  const textarea = container.querySelector('.code-editor-input');

  function render() {
    code.innerHTML = highlight(textarea.value) + '\n';
  }

  function syncScroll() {
    pre.scrollTop = textarea.scrollTop;
    pre.scrollLeft = textarea.scrollLeft;
  }

  textarea.value = initialCode;
  render();

  textarea.addEventListener('input', () => {
    render();
    syncScroll();
    if (onChange) onChange(textarea.value);
  });
  textarea.addEventListener('scroll', syncScroll);

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.slice(0, start) + '  ' + textarea.value.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      render();
      syncScroll();
      if (onChange) onChange(textarea.value);
    }
  });

  return {
    getValue: () => textarea.value,
    setValue: (val) => {
      textarea.value = val;
      render();
      syncScroll();
    },
    focus: () => textarea.focus(),
    destroy: () => {
      container.innerHTML = '';
    },
  };
}
