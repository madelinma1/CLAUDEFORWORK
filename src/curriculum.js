// CodeForge curriculum data.
// Each world unlocks after the previous world reaches its unlock threshold.
// Level "type" drives how the challenge view runs & grades it:
//   "function" -> user implements `functionName`; tests call it with args and deep-equal the return value
//   "output"   -> user writes free-form code; we compare captured console.log lines to expectedOutput
//   "predict"  -> multiple choice; no code execution, teaches reading code precisely

export const WORLDS = [
  {
    id: 'w1',
    name: 'Foundations',
    tagline: 'Variables, types, and your first lines of code',
    theme: 'foundations',
    unlockAt: 0,
    levels: [
      {
        id: 'w1-l1',
        title: 'Hello, Variables',
        concept: 'Variables & Strings',
        xp: 50,
        type: 'function',
        functionName: 'greet',
        lesson: `
          <p>Every program starts with <strong>data</strong>. A <code>variable</code> is a labeled box that holds a value.</p>
          <p>A <strong>template literal</strong> lets you drop a variable straight into a string using backticks and <code>\${}</code>:</p>
          <pre><code>const name = "Ada";
console.log(\`Hello, \${name}!\`); // "Hello, Ada!"</code></pre>
          <p>Write a function <code>greet(name)</code> that returns <code>"Hello, &lt;name&gt;!"</code>.</p>
        `,
        starter: `function greet(name) {\n  // your code here\n}`,
        tests: [
          { args: ['Ada'], expected: 'Hello, Ada!', desc: 'greet("Ada")' },
          { args: ['Grace'], expected: 'Hello, Grace!', desc: 'greet("Grace")' },
          { args: [''], expected: 'Hello, !', desc: 'greet("")' },
        ],
        hints: [
          'Use a template literal with backticks: `Hello, ${name}!`',
          'Don’t forget the `return` keyword — without it your function gives back `undefined`.',
        ],
        solution: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}`,
      },
      {
        id: 'w1-l2',
        title: 'Basic Math',
        concept: 'Numbers & Operators',
        xp: 50,
        type: 'function',
        functionName: 'rectangleArea',
        lesson: `
          <p>JavaScript supports the usual arithmetic operators: <code>+ - * / %</code>.</p>
          <p>Write <code>rectangleArea(width, height)</code> that returns the area of a rectangle.</p>
        `,
        starter: `function rectangleArea(width, height) {\n  // your code here\n}`,
        tests: [
          { args: [3, 4], expected: 12, desc: 'rectangleArea(3, 4)' },
          { args: [5, 5], expected: 25, desc: 'rectangleArea(5, 5)' },
          { args: [0, 10], expected: 0, desc: 'rectangleArea(0, 10)' },
        ],
        hints: ['Area = width × height. Use `*` to multiply.'],
        solution: `function rectangleArea(width, height) {\n  return width * height;\n}`,
      },
      {
        id: 'w1-l3',
        title: 'Type Detective',
        concept: 'typeof & Data Types',
        xp: 40,
        type: 'predict',
        lesson: `<p>JavaScript has several primitive types. <code>typeof</code> tells you which one a value is.</p>`,
        code: `console.log(typeof 42);
console.log(typeof "42");
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof [1, 2, 3]);`,
        options: [
          'number, string, boolean, undefined, array',
          'number, string, boolean, undefined, object',
          'int, string, bool, undefined, object',
          'number, string, boolean, null, object',
        ],
        correctIndex: 1,
        explanation: 'Arrays report as "object" for typeof — use Array.isArray() to detect them specifically.',
      },
      {
        id: 'w1-l4',
        title: 'String Building',
        concept: 'String Concatenation',
        xp: 50,
        type: 'function',
        functionName: 'fullName',
        lesson: `<p>Write <code>fullName(first, last)</code> that returns <code>"First Last"</code> (single space between them).</p>`,
        starter: `function fullName(first, last) {\n  // your code here\n}`,
        tests: [
          { args: ['Ada', 'Lovelace'], expected: 'Ada Lovelace', desc: 'fullName("Ada","Lovelace")' },
          { args: ['Grace', 'Hopper'], expected: 'Grace Hopper', desc: 'fullName("Grace","Hopper")' },
        ],
        hints: ['Template literal: `${first} ${last}`', 'Or use the `+` operator with a space in between.'],
        solution: `function fullName(first, last) {\n  return \`\${first} \${last}\`;\n}`,
      },
      {
        id: 'w1-l5',
        title: 'Truthy or Falsy',
        concept: 'Boolean Coercion',
        xp: 40,
        type: 'predict',
        lesson: `<p>Six values are "falsy" in JS: <code>false, 0, "", null, undefined, NaN</code>. Everything else is truthy.</p>`,
        code: `const values = [0, "", "0", null, undefined, [], {}, NaN];
const truthyCount = values.filter(Boolean).length;
console.log(truthyCount);`,
        options: ['0', '2', '4', '8'],
        correctIndex: 1,
        explanation: '"0" (non-empty string), [] and {} are all truthy — but the filter only keeps values that pass Boolean(); only [] and {} survive here (2 total). Empty arrays/objects are truthy even though they look "empty"!',
      },
      {
        id: 'w1-l6',
        title: 'Temperature Converter',
        concept: 'Arithmetic Formulas',
        xp: 50,
        type: 'function',
        functionName: 'celsiusToFahrenheit',
        lesson: `<p>Formula: <code>F = C × 9/5 + 32</code>. Write <code>celsiusToFahrenheit(c)</code>.</p>`,
        starter: `function celsiusToFahrenheit(c) {\n  // your code here\n}`,
        tests: [
          { args: [0], expected: 32, desc: 'celsiusToFahrenheit(0)' },
          { args: [100], expected: 212, desc: 'celsiusToFahrenheit(100)' },
          { args: [37], expected: 98.6, desc: 'celsiusToFahrenheit(37)' },
        ],
        hints: ['return c * 9 / 5 + 32;'],
        solution: `function celsiusToFahrenheit(c) {\n  return c * 9 / 5 + 32;\n}`,
      },
    ],
  },
  {
    id: 'w2',
    name: 'Control Flow',
    tagline: 'Decisions and repetition',
    theme: 'control-flow',
    unlockAt: 0.7,
    levels: [
      {
        id: 'w2-l1',
        title: 'Even or Odd',
        concept: 'if / else & Modulo',
        xp: 50,
        type: 'function',
        functionName: 'isEven',
        lesson: `<p>The modulo operator <code>%</code> gives the remainder of division. <code>n % 2 === 0</code> means <code>n</code> is even.</p>`,
        starter: `function isEven(n) {\n  // your code here\n}`,
        tests: [
          { args: [4], expected: true, desc: 'isEven(4)' },
          { args: [7], expected: false, desc: 'isEven(7)' },
          { args: [0], expected: true, desc: 'isEven(0)' },
          { args: [-3], expected: false, desc: 'isEven(-3)' },
        ],
        hints: ['return n % 2 === 0;'],
        solution: `function isEven(n) {\n  return n % 2 === 0;\n}`,
      },
      {
        id: 'w2-l2',
        title: 'FizzBuzz',
        concept: 'Chained Conditionals',
        xp: 60,
        type: 'function',
        functionName: 'fizzbuzzOne',
        lesson: `
          <p>The classic! Write <code>fizzbuzzOne(n)</code> that returns:</p>
          <ul><li><code>"Fizz"</code> if divisible by 3</li><li><code>"Buzz"</code> if divisible by 5</li>
          <li><code>"FizzBuzz"</code> if divisible by both</li><li>otherwise the number itself, as a string</li></ul>
        `,
        starter: `function fizzbuzzOne(n) {\n  // your code here\n}`,
        tests: [
          { args: [15], expected: 'FizzBuzz', desc: 'fizzbuzzOne(15)' },
          { args: [9], expected: 'Fizz', desc: 'fizzbuzzOne(9)' },
          { args: [10], expected: 'Buzz', desc: 'fizzbuzzOne(10)' },
          { args: [7], expected: '7', desc: 'fizzbuzzOne(7)' },
        ],
        hints: ['Check divisible-by-both FIRST, before checking 3 or 5 alone.', 'Use `String(n)` or `` `${n}` `` to convert the number to text.'],
        solution: `function fizzbuzzOne(n) {\n  if (n % 15 === 0) return 'FizzBuzz';\n  if (n % 3 === 0) return 'Fizz';\n  if (n % 5 === 0) return 'Buzz';\n  return String(n);\n}`,
      },
      {
        id: 'w2-l3',
        title: 'Loop Prediction',
        concept: 'for loops',
        xp: 40,
        type: 'predict',
        lesson: `<p>Trace through the loop carefully — note where the loop starts and stops.</p>`,
        code: `let total = 0;
for (let i = 1; i < 5; i++) {
  total += i;
}
console.log(total);`,
        options: ['10', '15', '14', '9'],
        correctIndex: 0,
        explanation: 'i takes values 1,2,3,4 (stops before 5) — sum = 1+2+3+4 = 10.',
      },
      {
        id: 'w2-l4',
        title: 'Sum to N',
        concept: 'Loops & Accumulation',
        xp: 50,
        type: 'function',
        functionName: 'sumToN',
        lesson: `<p>Write <code>sumToN(n)</code> that returns the sum of all integers from 1 to n (inclusive) using a loop.</p>`,
        starter: `function sumToN(n) {\n  let total = 0;\n  // your code here\n  return total;\n}`,
        tests: [
          { args: [5], expected: 15, desc: 'sumToN(5)' },
          { args: [1], expected: 1, desc: 'sumToN(1)' },
          { args: [10], expected: 55, desc: 'sumToN(10)' },
        ],
        hints: ['for (let i = 1; i <= n; i++) { total += i; }'],
        solution: `function sumToN(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}`,
      },
      {
        id: 'w2-l5',
        title: 'Count Vowels',
        concept: 'Loops over Strings',
        xp: 55,
        type: 'function',
        functionName: 'countVowels',
        lesson: `<p>Write <code>countVowels(str)</code> that counts how many of <code>a e i o u</code> (any case) appear in a string.</p>`,
        starter: `function countVowels(str) {\n  // your code here\n}`,
        tests: [
          { args: ['hello'], expected: 2, desc: 'countVowels("hello")' },
          { args: ['AEIOU'], expected: 5, desc: 'countVowels("AEIOU")' },
          { args: ['xyz'], expected: 0, desc: 'countVowels("xyz")' },
        ],
        hints: ['Loop through each character with `for...of` and check `"aeiou".includes(char.toLowerCase())`.'],
        solution: `function countVowels(str) {\n  let count = 0;\n  for (const char of str) {\n    if ('aeiou'.includes(char.toLowerCase())) count++;\n  }\n  return count;\n}`,
      },
      {
        id: 'w2-l6',
        title: 'Grade Calculator',
        concept: 'if / else if chains',
        xp: 50,
        type: 'function',
        functionName: 'letterGrade',
        lesson: `<p>Write <code>letterGrade(score)</code>: 90+ → "A", 80-89 → "B", 70-79 → "C", 60-69 → "D", below 60 → "F".</p>`,
        starter: `function letterGrade(score) {\n  // your code here\n}`,
        tests: [
          { args: [95], expected: 'A', desc: 'letterGrade(95)' },
          { args: [82], expected: 'B', desc: 'letterGrade(82)' },
          { args: [70], expected: 'C', desc: 'letterGrade(70)' },
          { args: [45], expected: 'F', desc: 'letterGrade(45)' },
        ],
        hints: ['Check from highest to lowest with `if / else if / else`.'],
        solution: `function letterGrade(score) {\n  if (score >= 90) return 'A';\n  if (score >= 80) return 'B';\n  if (score >= 70) return 'C';\n  if (score >= 60) return 'D';\n  return 'F';\n}`,
      },
    ],
  },
  {
    id: 'w3',
    name: 'Functions',
    tagline: 'Reusable logic, scope, and recursion',
    theme: 'functions',
    unlockAt: 0.7,
    levels: [
      {
        id: 'w3-l1',
        title: 'Function Basics',
        concept: 'Parameters & Return',
        xp: 50,
        type: 'function',
        functionName: 'square',
        lesson: `<p>Functions take inputs (parameters) and give back an output (the return value). Write <code>square(x)</code>.</p>`,
        starter: `function square(x) {\n  // your code here\n}`,
        tests: [
          { args: [4], expected: 16, desc: 'square(4)' },
          { args: [-3], expected: 9, desc: 'square(-3)' },
          { args: [0], expected: 0, desc: 'square(0)' },
        ],
        hints: ['return x * x;'],
        solution: `function square(x) {\n  return x * x;\n}`,
      },
      {
        id: 'w3-l2',
        title: 'Default Parameters',
        concept: 'Default Values',
        xp: 55,
        type: 'function',
        functionName: 'power',
        lesson: `<p>Parameters can have defaults: <code>function power(base, exp = 2)</code> makes <code>exp</code> optional. Write <code>power(base, exp = 2)</code> that returns <code>base ** exp</code>.</p>`,
        starter: `function power(base, exp = 2) {\n  // your code here\n}`,
        tests: [
          { args: [3], expected: 9, desc: 'power(3)' },
          { args: [2, 3], expected: 8, desc: 'power(2, 3)' },
          { args: [5, 0], expected: 1, desc: 'power(5, 0)' },
        ],
        hints: ['Use the exponent operator: `base ** exp`.'],
        solution: `function power(base, exp = 2) {\n  return base ** exp;\n}`,
      },
      {
        id: 'w3-l3',
        title: 'Arrow Function Rewrite',
        concept: 'Arrow Functions',
        xp: 40,
        type: 'predict',
        lesson: `<p>Arrow functions are a compact syntax for writing functions. A single expression body returns implicitly (no <code>{}</code>, no <code>return</code> needed).</p>`,
        code: `const triple = x => x * 3;
const shout = (s) => s.toUpperCase() + "!";
console.log(triple(4), shout("go"));`,
        options: ['"12 GO!"', '12 "GO!"', '"12GO!"', 'undefined undefined'],
        correctIndex: 1,
        explanation: 'console.log prints multiple arguments space-separated: the number 12, then the string "GO!".',
      },
      {
        id: 'w3-l4',
        title: 'Return Early',
        concept: 'Early Returns / Guard Clauses',
        xp: 50,
        type: 'function',
        functionName: 'absoluteValue',
        lesson: `<p>An early <code>return</code> can simplify logic. Write <code>absoluteValue(n)</code> without using <code>Math.abs</code>.</p>`,
        starter: `function absoluteValue(n) {\n  // your code here\n}`,
        tests: [
          { args: [-5], expected: 5, desc: 'absoluteValue(-5)' },
          { args: [5], expected: 5, desc: 'absoluteValue(5)' },
          { args: [0], expected: 0, desc: 'absoluteValue(0)' },
        ],
        hints: ['if (n < 0) return -n; then fall through to return n.'],
        solution: `function absoluteValue(n) {\n  if (n < 0) return -n;\n  return n;\n}`,
      },
      {
        id: 'w3-l5',
        title: 'Closures Intro',
        concept: 'Closures',
        xp: 65,
        type: 'function',
        functionName: 'makeCounter',
        lesson: `
          <p>A <strong>closure</strong> is a function that "remembers" the variables from where it was created, even after that outer function has finished running.</p>
          <p>Write <code>makeCounter()</code> that returns a function. Each time you call the returned function, it should return the next count starting at 1 (1, then 2, then 3...).</p>
        `,
        starter: `function makeCounter() {\n  // your code here\n}`,
        tests: [
          { args: [], expected: [1, 2, 3], desc: 'call the returned function 3 times', mode: 'counterSequence' },
        ],
        hints: ['Keep a `let count = 0;` variable in the outer function, and return `() => { count++; return count; }`.'],
        solution: `function makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}`,
      },
      {
        id: 'w3-l6',
        title: 'Recursion Intro',
        concept: 'Recursion',
        xp: 60,
        type: 'function',
        functionName: 'factorial',
        lesson: `
          <p>A recursive function calls itself with a smaller input until it reaches a <strong>base case</strong>.</p>
          <p>Write <code>factorial(n)</code>: <code>factorial(0) = 1</code>, and <code>factorial(n) = n × factorial(n-1)</code>.</p>
        `,
        starter: `function factorial(n) {\n  // your code here\n}`,
        tests: [
          { args: [0], expected: 1, desc: 'factorial(0)' },
          { args: [1], expected: 1, desc: 'factorial(1)' },
          { args: [5], expected: 120, desc: 'factorial(5)' },
        ],
        hints: ['Base case: if (n <= 1) return 1;', 'Recursive case: return n * factorial(n - 1);'],
        solution: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}`,
      },
    ],
  },
  {
    id: 'w4',
    name: 'Data Structures',
    tagline: 'Arrays, objects, and the methods that tame them',
    theme: 'data',
    unlockAt: 0.7,
    levels: [
      {
        id: 'w4-l1',
        title: 'Array Basics',
        concept: 'Indexing',
        xp: 50,
        type: 'function',
        functionName: 'firstAndLast',
        lesson: `<p>Arrays are ordered lists, indexed from 0. Write <code>firstAndLast(arr)</code> returning a 2-element array <code>[first, last]</code>.</p>`,
        starter: `function firstAndLast(arr) {\n  // your code here\n}`,
        tests: [
          { args: [[1, 2, 3, 4]], expected: [1, 4], desc: 'firstAndLast([1,2,3,4])' },
          { args: [['a']], expected: ['a', 'a'], desc: 'firstAndLast(["a"])' },
        ],
        hints: ['arr[0] is the first item, arr[arr.length - 1] is the last.'],
        solution: `function firstAndLast(arr) {\n  return [arr[0], arr[arr.length - 1]];\n}`,
      },
      {
        id: 'w4-l2',
        title: 'The .map() Method',
        concept: 'Array.map',
        xp: 55,
        type: 'function',
        functionName: 'doubleAll',
        lesson: `<p><code>.map()</code> transforms every element of an array into a new array. Write <code>doubleAll(arr)</code> returning each number doubled.</p>`,
        starter: `function doubleAll(arr) {\n  // your code here\n}`,
        tests: [
          { args: [[1, 2, 3]], expected: [2, 4, 6], desc: 'doubleAll([1,2,3])' },
          { args: [[]], expected: [], desc: 'doubleAll([])' },
        ],
        hints: ['return arr.map(x => x * 2);'],
        solution: `function doubleAll(arr) {\n  return arr.map(x => x * 2);\n}`,
      },
      {
        id: 'w4-l3',
        title: 'The .filter() Method',
        concept: 'Array.filter',
        xp: 55,
        type: 'function',
        functionName: 'evensOnly',
        lesson: `<p><code>.filter()</code> keeps only elements that pass a test. Write <code>evensOnly(arr)</code> returning only the even numbers.</p>`,
        starter: `function evensOnly(arr) {\n  // your code here\n}`,
        tests: [
          { args: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6], desc: 'evensOnly([1..6])' },
          { args: [[1, 3, 5]], expected: [], desc: 'evensOnly([1,3,5])' },
        ],
        hints: ['return arr.filter(x => x % 2 === 0);'],
        solution: `function evensOnly(arr) {\n  return arr.filter(x => x % 2 === 0);\n}`,
      },
      {
        id: 'w4-l4',
        title: 'The .reduce() Method',
        concept: 'Array.reduce',
        xp: 60,
        type: 'function',
        functionName: 'sumArray',
        lesson: `<p><code>.reduce()</code> folds an array down to a single value. Write <code>sumArray(arr)</code> using <code>.reduce()</code>.</p>`,
        starter: `function sumArray(arr) {\n  // your code here\n}`,
        tests: [
          { args: [[1, 2, 3, 4]], expected: 10, desc: 'sumArray([1,2,3,4])' },
          { args: [[]], expected: 0, desc: 'sumArray([])' },
        ],
        hints: ['return arr.reduce((acc, x) => acc + x, 0); — the second argument (0) is the starting value.'],
        solution: `function sumArray(arr) {\n  return arr.reduce((acc, x) => acc + x, 0);\n}`,
      },
      {
        id: 'w4-l5',
        title: 'Objects & Destructuring',
        concept: 'Objects',
        xp: 55,
        type: 'function',
        functionName: 'getFullName',
        lesson: `<p>Objects hold key-value data. Destructuring pulls values straight out: <code>function f({a, b}) {...}</code>. Write <code>getFullName(person)</code> where <code>person = {first, last}</code>, returning <code>"First Last"</code>.</p>`,
        starter: `function getFullName(person) {\n  // your code here\n}`,
        tests: [
          { args: [{ first: 'Ada', last: 'Lovelace' }], expected: 'Ada Lovelace', desc: 'getFullName({first:"Ada",last:"Lovelace"})' },
          { args: [{ first: 'Alan', last: 'Turing' }], expected: 'Alan Turing', desc: 'getFullName({first:"Alan",last:"Turing"})' },
        ],
        hints: ['const { first, last } = person; return `${first} ${last}`;'],
        solution: `function getFullName(person) {\n  const { first, last } = person;\n  return \`\${first} \${last}\`;\n}`,
      },
      {
        id: 'w4-l6',
        title: 'Sets & Uniqueness',
        concept: 'Set',
        xp: 60,
        type: 'function',
        functionName: 'uniqueValues',
        lesson: `<p>A <code>Set</code> only stores unique values. Write <code>uniqueValues(arr)</code> returning an array of the distinct values, in first-seen order.</p>`,
        starter: `function uniqueValues(arr) {\n  // your code here\n}`,
        tests: [
          { args: [[1, 2, 2, 3, 1, 4]], expected: [1, 2, 3, 4], desc: 'uniqueValues([1,2,2,3,1,4])' },
          { args: [['a', 'a', 'a']], expected: ['a'], desc: 'uniqueValues(["a","a","a"])' },
        ],
        hints: ['return [...new Set(arr)];'],
        solution: `function uniqueValues(arr) {\n  return [...new Set(arr)];\n}`,
      },
    ],
  },
  {
    id: 'w5',
    name: 'Algorithms & Complexity',
    tagline: 'Search, sort, and think about speed',
    theme: 'algorithms',
    unlockAt: 0.7,
    levels: [
      {
        id: 'w5-l1',
        title: 'Linear Search',
        concept: 'O(n) Search',
        xp: 55,
        type: 'function',
        functionName: 'linearSearch',
        lesson: `<p>Linear search checks each element one by one. Write <code>linearSearch(arr, target)</code> returning the index of <code>target</code>, or <code>-1</code> if absent.</p>`,
        starter: `function linearSearch(arr, target) {\n  // your code here\n}`,
        tests: [
          { args: [[5, 3, 8, 1], 8], expected: 2, desc: 'linearSearch([5,3,8,1], 8)' },
          { args: [[5, 3, 8, 1], 9], expected: -1, desc: 'linearSearch([5,3,8,1], 9)' },
        ],
        hints: ['Loop with index i; if arr[i] === target, return i. After the loop, return -1.'],
        solution: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
      },
      {
        id: 'w5-l2',
        title: 'Binary Search',
        concept: 'O(log n) Search',
        xp: 70,
        type: 'function',
        functionName: 'binarySearch',
        lesson: `
          <p>On a <strong>sorted</strong> array, binary search halves the search space every step — O(log n) instead of O(n).</p>
          <p>Write <code>binarySearch(sortedArr, target)</code> returning the index, or -1.</p>
        `,
        starter: `function binarySearch(sortedArr, target) {\n  let low = 0;\n  let high = sortedArr.length - 1;\n  // your code here\n  return -1;\n}`,
        tests: [
          { args: [[1, 3, 5, 7, 9, 11], 7], expected: 3, desc: 'binarySearch([1,3,5,7,9,11], 7)' },
          { args: [[1, 3, 5, 7, 9, 11], 2], expected: -1, desc: 'binarySearch([1,3,5,7,9,11], 2)' },
          { args: [[1], 1], expected: 0, desc: 'binarySearch([1], 1)' },
        ],
        hints: ['while (low <= high) { const mid = Math.floor((low+high)/2); ... }', 'If sortedArr[mid] < target, search the right half (low = mid + 1); otherwise search the left half (high = mid - 1).'],
        solution: `function binarySearch(sortedArr, target) {\n  let low = 0;\n  let high = sortedArr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (sortedArr[mid] === target) return mid;\n    if (sortedArr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`,
      },
      {
        id: 'w5-l3',
        title: 'Bubble Sort',
        concept: 'O(n²) Sorting',
        xp: 65,
        type: 'function',
        functionName: 'bubbleSort',
        lesson: `<p>Bubble sort repeatedly swaps adjacent out-of-order pairs. Write <code>bubbleSort(arr)</code> returning a new sorted array (ascending), without mutating the input.</p>`,
        starter: `function bubbleSort(arr) {\n  const a = [...arr];\n  // your code here\n  return a;\n}`,
        tests: [
          { args: [[5, 3, 8, 1, 2]], expected: [1, 2, 3, 5, 8], desc: 'bubbleSort([5,3,8,1,2])' },
          { args: [[1]], expected: [1], desc: 'bubbleSort([1])' },
          { args: [[]], expected: [], desc: 'bubbleSort([])' },
        ],
        hints: ['Nested loops: for each pass, compare a[j] and a[j+1], swap if a[j] > a[j+1].'],
        solution: `function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length; i++) {\n    for (let j = 0; j < a.length - i - 1; j++) {\n      if (a[j] > a[j + 1]) {\n        [a[j], a[j + 1]] = [a[j + 1], a[j]];\n      }\n    }\n  }\n  return a;\n}`,
      },
      {
        id: 'w5-l4',
        title: 'Big-O Quiz',
        concept: 'Time Complexity',
        xp: 45,
        type: 'predict',
        lesson: `<p>Count how the work grows as <code>n</code> grows.</p>`,
        code: `function mystery(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      count++;
    }
  }
  return count;
}`,
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
        correctIndex: 2,
        explanation: 'Two nested loops each running n times means n × n = n² total operations — classic O(n²).',
      },
      {
        id: 'w5-l5',
        title: 'Fibonacci (Recursion + Memoization)',
        concept: 'Recursion & Memoization',
        xp: 70,
        type: 'function',
        functionName: 'fibonacci',
        lesson: `
          <p>The Fibonacci sequence: each number is the sum of the two before it (0, 1, 1, 2, 3, 5, 8...).</p>
          <p>Write <code>fibonacci(n)</code> where <code>fibonacci(0) = 0</code>, <code>fibonacci(1) = 1</code>. Try using <strong>memoization</strong> (caching results) so it stays fast for larger n.</p>
        `,
        starter: `function fibonacci(n, memo = {}) {\n  // your code here\n}`,
        tests: [
          { args: [0], expected: 0, desc: 'fibonacci(0)' },
          { args: [1], expected: 1, desc: 'fibonacci(1)' },
          { args: [10], expected: 55, desc: 'fibonacci(10)' },
          { args: [20], expected: 6765, desc: 'fibonacci(20)' },
        ],
        hints: ['Base cases: if (n <= 1) return n;', 'Check `if (memo[n] !== undefined) return memo[n];` before recursing, and store the result: `memo[n] = ...`.'],
        solution: `function fibonacci(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n] !== undefined) return memo[n];\n  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n  return memo[n];\n}`,
      },
      {
        id: 'w5-l6',
        title: 'Two Pointers',
        concept: 'Two-Pointer Technique',
        xp: 65,
        type: 'function',
        functionName: 'hasPairWithSum',
        lesson: `
          <p>For a <strong>sorted</strong> array, the two-pointer technique finds a pair summing to a target in O(n) — no nested loop needed.</p>
          <p>Write <code>hasPairWithSum(sortedArr, target)</code> returning <code>true</code>/<code>false</code>.</p>
        `,
        starter: `function hasPairWithSum(sortedArr, target) {\n  let left = 0;\n  let right = sortedArr.length - 1;\n  // your code here\n  return false;\n}`,
        tests: [
          { args: [[1, 2, 4, 7, 11], 11], expected: true, desc: 'hasPairWithSum([1,2,4,7,11], 11)' },
          { args: [[1, 2, 4, 7, 11], 3], expected: true, desc: 'hasPairWithSum([1,2,4,7,11], 3)' },
          { args: [[1, 2, 4, 7, 11], 100], expected: false, desc: 'hasPairWithSum([1,2,4,7,11], 100)' },
        ],
        hints: ['while (left < right): if sum === target return true; if sum < target, left++; else right--;'],
        solution: `function hasPairWithSum(sortedArr, target) {\n  let left = 0;\n  let right = sortedArr.length - 1;\n  while (left < right) {\n    const sum = sortedArr[left] + sortedArr[right];\n    if (sum === target) return true;\n    if (sum < target) left++;\n    else right--;\n  }\n  return false;\n}`,
      },
    ],
  },
  {
    id: 'w6',
    name: 'Advanced JS & Engineering',
    tagline: 'Closures, async, classes, and clean error handling',
    theme: 'advanced',
    unlockAt: 0.7,
    levels: [
      {
        id: 'w6-l1',
        title: 'Closures Deep Dive',
        concept: 'Closures & Encapsulation',
        xp: 70,
        type: 'function',
        functionName: 'makeBankAccount',
        lesson: `
          <p>Closures let you build private state. Write <code>makeBankAccount(balance)</code> returning an object with:</p>
          <ul><li><code>deposit(amount)</code> — adds to balance, returns new balance</li>
          <li><code>withdraw(amount)</code> — subtracts from balance (never below 0), returns new balance</li>
          <li><code>getBalance()</code> — returns current balance</li></ul>
        `,
        starter: `function makeBankAccount(balance) {\n  // your code here\n}`,
        tests: [
          { args: [100], expected: [150, 130, 130], desc: 'deposit(50) then withdraw(20) then getBalance()', mode: 'bankSequence' },
        ],
        hints: ['Keep `balance` as a variable in the outer function scope, and mutate it inside the returned methods.', 'For withdraw, use Math.max(0, balance - amount) to prevent going negative.'],
        solution: `function makeBankAccount(balance) {\n  return {\n    deposit(amount) {\n      balance += amount;\n      return balance;\n    },\n    withdraw(amount) {\n      balance = Math.max(0, balance - amount);\n      return balance;\n    },\n    getBalance() {\n      return balance;\n    },\n  };\n}`,
      },
      {
        id: 'w6-l2',
        title: 'Function Composition',
        concept: 'Higher-Order Functions',
        xp: 65,
        type: 'function',
        functionName: 'compose',
        lesson: `<p>A higher-order function takes or returns other functions. Write <code>compose(f, g)</code> returning a new function <code>h(x) = f(g(x))</code>.</p>`,
        starter: `function compose(f, g) {\n  // your code here\n}`,
        tests: [
          { argsSource: ['(x) => x + 1', '(x) => x * 2'], expected: 7, desc: 'compose(x=>x+1, x=>x*2)(3) should be 7', mode: 'composeCall', callArg: 3 },
        ],
        hints: ['return function(x) { return f(g(x)); };'],
        solution: `function compose(f, g) {\n  return function(x) {\n    return f(g(x));\n  };\n}`,
      },
      {
        id: 'w6-l3',
        title: 'Sync vs Async Order',
        concept: 'Event Loop',
        xp: 50,
        type: 'predict',
        lesson: `<p>JavaScript runs synchronous code first, then processes the microtask/callback queue (Promises, setTimeout).</p>`,
        code: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");`,
        options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
        correctIndex: 1,
        explanation: 'Sync code (1, 4) runs first. Then microtasks (Promise .then → 3) run before macrotasks (setTimeout → 2), even with a 0ms delay.',
      },
      {
        id: 'w6-l4',
        title: 'Async/Await',
        concept: 'Promises',
        xp: 70,
        type: 'function',
        functionName: 'delayedDouble',
        lesson: `
          <p><code>async</code> functions return Promises; <code>await</code> pauses until a Promise resolves.</p>
          <p>Write <code>async function delayedDouble(n)</code> that returns a Promise resolving to <code>n * 2</code> (you can resolve immediately — no real delay needed).</p>
        `,
        starter: `async function delayedDouble(n) {\n  // your code here\n}`,
        tests: [
          { args: [5], expected: 10, desc: 'await delayedDouble(5)', async: true },
          { args: [0], expected: 0, desc: 'await delayedDouble(0)', async: true },
        ],
        hints: ['You can just `return n * 2;` — an async function automatically wraps the return value in a Promise.', 'Or explicitly: return new Promise(resolve => resolve(n * 2));'],
        solution: `async function delayedDouble(n) {\n  return n * 2;\n}`,
      },
      {
        id: 'w6-l5',
        title: 'Classes & OOP',
        concept: 'Classes',
        xp: 60,
        type: 'function',
        functionName: 'makeAnimalSound',
        lesson: `
          <p>Classes bundle data and behavior. Define a class <code>Animal</code> with a constructor <code>(name, sound)</code> and a method <code>speak()</code> returning <code>"&lt;name&gt; says &lt;sound&gt;"</code>.</p>
          <p>Then write <code>makeAnimalSound(name, sound)</code> that creates an <code>Animal</code> and returns the result of calling <code>.speak()</code>.</p>
        `,
        starter: `class Animal {\n  constructor(name, sound) {\n    // your code here\n  }\n  speak() {\n    // your code here\n  }\n}\n\nfunction makeAnimalSound(name, sound) {\n  // your code here\n}`,
        tests: [
          { args: ['Rex', 'Woof'], expected: 'Rex says Woof', desc: 'makeAnimalSound("Rex","Woof")' },
          { args: ['Cat', 'Meow'], expected: 'Cat says Meow', desc: 'makeAnimalSound("Cat","Meow")' },
        ],
        hints: ['constructor(name, sound) { this.name = name; this.sound = sound; }', 'speak() { return `${this.name} says ${this.sound}`; }', 'In makeAnimalSound: const a = new Animal(name, sound); return a.speak();'],
        solution: `class Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n  speak() {\n    return \`\${this.name} says \${this.sound}\`;\n  }\n}\n\nfunction makeAnimalSound(name, sound) {\n  const a = new Animal(name, sound);\n  return a.speak();\n}`,
      },
      {
        id: 'w6-l6',
        title: 'Error Handling',
        concept: 'try / catch / throw',
        xp: 60,
        type: 'function',
        functionName: 'safeDivide',
        lesson: `<p>Write <code>safeDivide(a, b)</code>: if <code>b === 0</code>, <code>throw new Error('Cannot divide by zero')</code> and catch it inside the same function, returning the string <code>"Error: Cannot divide by zero"</code>. Otherwise return <code>a / b</code>.</p>`,
        starter: `function safeDivide(a, b) {\n  try {\n    // your code here\n  } catch (err) {\n    return \`Error: \${err.message}\`;\n  }\n}`,
        tests: [
          { args: [10, 2], expected: 5, desc: 'safeDivide(10, 2)' },
          { args: [10, 0], expected: 'Error: Cannot divide by zero', desc: 'safeDivide(10, 0)' },
        ],
        hints: ["if (b === 0) throw new Error('Cannot divide by zero'); return a / b;"],
        solution: `function safeDivide(a, b) {\n  try {\n    if (b === 0) throw new Error('Cannot divide by zero');\n    return a / b;\n  } catch (err) {\n    return \`Error: \${err.message}\`;\n  }\n}`,
      },
    ],
  },
  {
    id: 'w7',
    name: 'Building Blocks of AI',
    tagline: 'Capstone: the ideas behind modern AI systems',
    theme: 'ai',
    unlockAt: 0.7,
    levels: [
      {
        id: 'w7-l1',
        title: 'Tokenizer',
        concept: 'Text → Tokens',
        xp: 70,
        type: 'function',
        functionName: 'tokenize',
        lesson: `
          <p>Every language model starts by breaking text into <strong>tokens</strong>. Write a simple word-level <code>tokenize(text)</code>: lowercase the text, then split on whitespace, stripping basic punctuation (<code>. , ! ?</code>).</p>
        `,
        starter: `function tokenize(text) {\n  // your code here\n}`,
        tests: [
          { args: ['Hello, world!'], expected: ['hello', 'world'], desc: 'tokenize("Hello, world!")' },
          { args: ['One two  three.'], expected: ['one', 'two', 'three'], desc: 'tokenize("One two  three.")' },
        ],
        hints: [
          "Lowercase with .toLowerCase(), remove punctuation with .replace(/[.,!?]/g, ''), then .split on whitespace with /\\s+/.",
          "Filter out empty strings that can result from extra spaces: .filter(Boolean).",
        ],
        solution: `function tokenize(text) {\n  return text\n    .toLowerCase()\n    .replace(/[.,!?]/g, '')\n    .split(/\\s+/)\n    .filter(Boolean);\n}`,
      },
      {
        id: 'w7-l2',
        title: 'Word Frequency',
        concept: 'Counting & Objects',
        xp: 65,
        type: 'function',
        functionName: 'wordFrequency',
        lesson: `<p>A key building block for language stats. Write <code>wordFrequency(text)</code> returning an object mapping each lowercase word to how many times it appears.</p>`,
        starter: `function wordFrequency(text) {\n  // your code here\n}`,
        tests: [
          { args: ['the cat and the dog'], expected: { the: 2, cat: 1, and: 1, dog: 1 }, desc: 'wordFrequency("the cat and the dog")' },
        ],
        hints: ['Split the text into words, then loop through and do `counts[word] = (counts[word] || 0) + 1;`'],
        solution: `function wordFrequency(text) {\n  const words = text.toLowerCase().split(/\\s+/).filter(Boolean);\n  const counts = {};\n  for (const w of words) {\n    counts[w] = (counts[w] || 0) + 1;\n  }\n  return counts;\n}`,
      },
      {
        id: 'w7-l3',
        title: 'Simple Perceptron',
        concept: 'Neural Net Basics',
        xp: 80,
        type: 'function',
        functionName: 'perceptron',
        lesson: `
          <p>The perceptron is the simplest neural network unit: it multiplies each input by a weight, sums them plus a bias, then applies a <strong>step activation</strong> (1 if the sum is ≥ 0, else 0).</p>
          <p>Write <code>perceptron(inputs, weights, bias)</code> where <code>inputs</code> and <code>weights</code> are equal-length arrays.</p>
        `,
        starter: `function perceptron(inputs, weights, bias) {\n  // your code here\n}`,
        tests: [
          { args: [[1, 0], [0.6, 0.6], -0.5], expected: 1, desc: 'perceptron([1,0], [0.6,0.6], -0.5)' },
          { args: [[0, 0], [0.6, 0.6], -0.5], expected: 0, desc: 'perceptron([0,0], [0.6,0.6], -0.5)' },
          { args: [[1, 1], [0.6, 0.6], -0.5], expected: 1, desc: 'perceptron([1,1], [0.6,0.6], -0.5)' },
        ],
        hints: [
          'Sum = the dot product of inputs and weights, plus bias.',
          'Use .reduce() with the index to multiply corresponding pairs: inputs.reduce((sum, x, i) => sum + x * weights[i], 0) + bias',
          'Then: return sum >= 0 ? 1 : 0;',
        ],
        solution: `function perceptron(inputs, weights, bias) {\n  const sum = inputs.reduce((acc, x, i) => acc + x * weights[i], 0) + bias;\n  return sum >= 0 ? 1 : 0;\n}`,
      },
      {
        id: 'w7-l4',
        title: 'Markov Chain Prediction',
        concept: 'Statistical Text Generation',
        xp: 55,
        type: 'predict',
        lesson: `
          <p>A Markov chain predicts the next word using only the current word's transition frequencies — a tiny ancestor of how language models work statistically.</p>
        `,
        code: `const transitions = {
  the: { cat: 2, dog: 1 },
  cat: { sat: 3 },
};

function mostLikelyNext(word) {
  const options = transitions[word];
  if (!options) return null;
  return Object.entries(options)
    .sort((a, b) => b[1] - a[1])[0][0];
}

console.log(mostLikelyNext("the"));`,
        options: ['"dog"', '"cat"', '"sat"', 'null'],
        correctIndex: 1,
        explanation: '"the" transitions to "cat" (count 2) more often than "dog" (count 1), so sorting descending by count picks "cat" first.',
      },
      {
        id: 'w7-l5',
        title: 'Gradient Descent Step',
        concept: 'Optimization',
        xp: 75,
        type: 'function',
        functionName: 'gradientStep',
        lesson: `
          <p>Training a model means nudging its weights to reduce error. One <strong>gradient descent</strong> step is: <code>newWeight = weight - learningRate × gradient</code>.</p>
          <p>Write <code>gradientStep(weight, gradient, learningRate)</code>.</p>
        `,
        starter: `function gradientStep(weight, gradient, learningRate) {\n  // your code here\n}`,
        tests: [
          { args: [1.0, 0.5, 0.1], expected: 0.95, desc: 'gradientStep(1.0, 0.5, 0.1)' },
          { args: [2, 1, 0.5], expected: 1.5, desc: 'gradientStep(2, 1, 0.5)' },
        ],
        hints: ['return weight - learningRate * gradient;'],
        solution: `function gradientStep(weight, gradient, learningRate) {\n  return weight - learningRate * gradient;\n}`,
      },
      {
        id: 'w7-l6',
        title: 'Mini Agent Loop',
        concept: 'Decision Making',
        xp: 80,
        type: 'function',
        functionName: 'chooseBestAction',
        lesson: `
          <p>At the heart of every agent (from a simple bot to a tool-using AI) is a loop: look at the possible actions, score them, and pick the best one.</p>
          <p>Write <code>chooseBestAction(actionScores)</code> where <code>actionScores</code> is an object like <code>{ search: 0.4, reply: 0.9, wait: 0.1 }</code>. Return the <strong>key</strong> with the highest score. If there's a tie, return whichever comes first in the object.</p>
        `,
        starter: `function chooseBestAction(actionScores) {\n  // your code here\n}`,
        tests: [
          { args: [{ search: 0.4, reply: 0.9, wait: 0.1 }], expected: 'reply', desc: 'chooseBestAction({search:0.4, reply:0.9, wait:0.1})' },
          { args: [{ a: 1, b: 1 }], expected: 'a', desc: 'chooseBestAction({a:1, b:1}) tie -> first key' },
        ],
        hints: [
          'Object.entries(actionScores) gives you [key, value] pairs to compare.',
          'Track the best key and best score as you loop; only replace the best when a score is strictly greater.',
        ],
        solution: `function chooseBestAction(actionScores) {\n  let bestKey = null;\n  let bestScore = -Infinity;\n  for (const [key, score] of Object.entries(actionScores)) {\n    if (score > bestScore) {\n      bestScore = score;\n      bestKey = key;\n    }\n  }\n  return bestKey;\n}`,
      },
    ],
  },
];

export function getAllLevels() {
  const levels = [];
  for (const world of WORLDS) {
    for (const level of world.levels) {
      levels.push({ ...level, worldId: world.id, worldName: world.name });
    }
  }
  return levels;
}

export function getLevelById(id) {
  for (const world of WORLDS) {
    const found = world.levels.find((l) => l.id === id);
    if (found) return { ...found, worldId: world.id, worldName: world.name };
  }
  return null;
}

export function totalXpAvailable() {
  return getAllLevels().reduce((sum, l) => sum + l.xp, 0);
}
