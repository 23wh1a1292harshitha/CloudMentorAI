// Extra question types: predict_output, debugging, coding.
// Each question carries an explicit `type` field. The main bank normalises
// mcq questions with type:"mcq", so these stand apart by their own type.

export const questionsExtra = [

  // ══════════════════════════════════════════════════════════════════════════
  // PREDICT THE OUTPUT  (type: "predict_output")
  // Schema: { type, id, topic, difficulty, code, options[], correct_option_id, explanation }
  // ══════════════════════════════════════════════════════════════════════════

  { type:"predict_output", id:"po_var_e1", topic:"variables", difficulty:"easy",
    code:"x = 5\ny = x + 2\nprint(y)",
    options:[{id:"a",text:"5"},{id:"b",text:"7"},{id:"c",text:"2"},{id:"d",text:"52"}],
    correct_option_id:"b",
    explanation:"x is 5, so y = 5 + 2 = 7, and print(y) outputs 7." },

  { type:"predict_output", id:"po_var_e2", topic:"variables", difficulty:"easy",
    code:"a = 10\nb = a\nb = b + 5\nprint(a)",
    options:[{id:"a",text:"15"},{id:"b",text:"10"},{id:"c",text:"5"},{id:"d",text:"105"}],
    correct_option_id:"b",
    explanation:"Integers are immutable in Python. b = a copies the value 10, so changing b does not affect a." },

  { type:"predict_output", id:"po_forl_e1", topic:"for_loops", difficulty:"easy",
    code:"for i in range(3):\n    print(i, end=' ')",
    options:[{id:"a",text:"1 2 3"},{id:"b",text:"0 1 2"},{id:"c",text:"0 1 2 3"},{id:"d",text:"1 2"}],
    correct_option_id:"b",
    explanation:"range(3) yields 0, 1, 2. end=' ' keeps them on one line separated by spaces." },

  { type:"predict_output", id:"po_forl_m1", topic:"for_loops", difficulty:"medium",
    code:"total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)",
    options:[{id:"a",text:"10"},{id:"b",text:"15"},{id:"c",text:"6"},{id:"d",text:"4"}],
    correct_option_id:"a",
    explanation:"range(1,5) yields 1,2,3,4. Sum = 1+2+3+4 = 10." },

  { type:"predict_output", id:"po_fn_e1", topic:"functions", difficulty:"easy",
    code:"def add(a, b):\n    return a + b\nprint(add(3, 4))",
    options:[{id:"a",text:"7"},{id:"b",text:"34"},{id:"c",text:"12"},{id:"d",text:"Error"}],
    correct_option_id:"a",
    explanation:"add(3,4) returns 3+4=7, which is printed." },

  { type:"predict_output", id:"po_fn_m1", topic:"functions", difficulty:"medium",
    code:"def f(x=2):\n    return x * 3\nprint(f())\nprint(f(4))",
    options:[{id:"a",text:"6 12"},{id:"b",text:"2 4"},{id:"c",text:"6 6"},{id:"d",text:"Error"}],
    correct_option_id:"a",
    explanation:"f() uses the default x=2 → 6. f(4) → 4*3=12. Output: 6 then 12 on separate lines (shown joined here)." },

  { type:"predict_output", id:"po_rec_e1", topic:"recursion", difficulty:"easy",
    code:"def f(n):\n    if n == 0: return 0\n    return n + f(n-1)\nprint(f(3))",
    options:[{id:"a",text:"3"},{id:"b",text:"6"},{id:"c",text:"0"},{id:"d",text:"9"}],
    correct_option_id:"b",
    explanation:"f(3)=3+f(2)=3+2+f(1)=3+2+1+f(0)=3+2+1+0=6." },

  { type:"predict_output", id:"po_rec_m1", topic:"recursion", difficulty:"medium",
    code:"def fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)\nprint(fib(5))",
    options:[{id:"a",text:"5"},{id:"b",text:"8"},{id:"c",text:"3"},{id:"d",text:"13"}],
    correct_option_id:"a",
    explanation:"fib(5)=fib(4)+fib(3)=3+2=5." },

  { type:"predict_output", id:"po_whl_e1", topic:"while_loops", difficulty:"easy",
    code:"n = 3\nwhile n > 0:\n    print(n)\n    n -= 1",
    options:[{id:"a",text:"3 2 1"},{id:"b",text:"1 2 3"},{id:"c",text:"3 2 1 0"},{id:"d",text:"0 1 2 3"}],
    correct_option_id:"a",
    explanation:"n starts at 3, prints 3,2,1 then becomes 0 and the loop stops." },

  // ══════════════════════════════════════════════════════════════════════════
  // DEBUGGING (type: "debugging")
  // Schema: { type, id, topic, difficulty, code (buggy), options[], correct_option_id, explanation }
  // ══════════════════════════════════════════════════════════════════════════

  { type:"debugging", id:"dbg_var_e1", topic:"variables", difficulty:"easy",
    code:"x = 5\ny = X + 2\nprint(y)",
    options:[
      {id:"a",text:"Python is case-sensitive; 'X' is undefined, should be lowercase 'x'"},
      {id:"b",text:"Missing semicolon at the end of line 1"},
      {id:"c",text:"print() cannot take a variable"},
      {id:"d",text:"The + operator is invalid in Python"}
    ],
    correct_option_id:"a",
    explanation:"Variable names are case-sensitive. 'X' was never assigned; the correct reference is 'x'." },

  { type:"debugging", id:"dbg_forl_e1", topic:"for_loops", difficulty:"easy",
    code:"for i in range(5)\n    print(i)",
    options:[
      {id:"a",text:"Missing colon ':' after the for statement"},
      {id:"b",text:"range(5) is invalid"},
      {id:"c",text:"print(i) should be print[i]"},
      {id:"d",text:"The loop variable must be declared with let"}
    ],
    correct_option_id:"a",
    explanation:"Compound statements like 'for' require a trailing colon in Python." },

  { type:"debugging", id:"dbg_fn_e1", topic:"functions", difficulty:"easy",
    code:"def greet(name):\n    print('Hello', name)\n\ngreet('Ada'",
    options:[
      {id:"a",text:"Missing closing parenthesis ')' in the function call greet('Ada'"},
      {id:"b",text:"def is not a keyword in Python"},
      {id:"c",text:"print() needs two arguments"},
      {id:"d",text:"The function must return a value"}
    ],
    correct_option_id:"a",
    explanation:"The call to greet() is missing its closing parenthesis, causing a SyntaxError." },

  { type:"debugging", id:"dbg_fn_m1", topic:"functions", difficulty:"medium",
    code:"def multiply(a, b):\n    return a * b\n\nresult = multiply(3)\nprint(result)",
    options:[
      {id:"a",text:"multiply() requires two arguments but only one (3) is provided"},
      {id:"b",text:"The * operator does not work for numbers"},
      {id:"c",text:"print() must come before the function call"},
      {id:"d",text:"'result' is a reserved keyword"}
    ],
    correct_option_id:"a",
    explanation:"multiply(a, b) has two required parameters, but multiply(3) passes only one." },

  { type:"debugging", id:"dbg_rec_e1", topic:"recursion", difficulty:"easy",
    code:"def countdown(n):\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)",
    options:[
      {id:"a",text:"Missing base case — the recursion never stops, causing a RecursionError"},
      {id:"b",text:"print(n) is invalid inside a function"},
      {id:"c",text:"countdown must be defined with a class"},
      {id:"d",text:"n - 1 should be n + 1"}
    ],
    correct_option_id:"a",
    explanation:"There is no base case to stop the recursion, so it runs until the stack overflows." },

  { type:"debugging", id:"dbg_whl_e1", topic:"while_loops", difficulty:"easy",
    code:"n = 0\nwhile n < 3:\n    print(n)",
    options:[
      {id:"a",text:"n is never incremented, so the condition stays true forever — infinite loop"},
      {id:"b",text:"while is not a valid keyword"},
      {id:"c",text:"print(n) should be print(n+1)"},
      {id:"d",text:"n must be a float"}
    ],
    correct_option_id:"a",
    explanation:"The loop body never changes n, so n < 3 is always true → infinite loop." },

  // ══════════════════════════════════════════════════════════════════════════
  // CODING (type: "coding")
  // Schema: {
  //   type, id, topic, difficulty,
  //   problem_statement, input_format, output_format, constraints,
  //   sample_test_cases: [{ input, output }],   // shown to student
  //   hidden_test_cases:  [{ input, output }],  // SERVER-ONLY, never sent to client
  //   languages: ["python","java"],
  //   marks: 10
  // }
  // NOTE: Execution requires a secure sandbox. Until CODE_EXEC_ENABLED is set
  // in the testing-engine .env, the run endpoint returns a clear "not configured"
  // status and awards 0 marks (see routes/tests.js).
  // ══════════════════════════════════════════════════════════════════════════

  { type:"coding", id:"code_var_e1", topic:"variables", difficulty:"easy", marks:10,
    problem_statement:"Read two integers from input and print their sum.",
    input_format:"Two space-separated integers on a single line.",
    output_format:"A single integer: the sum of the two inputs.",
    constraints:"-1000 <= a, b <= 1000",
    sample_test_cases:[
      { input:"3 4", output:"7" },
      { input:"-5 10", output:"5" }
    ],
    hidden_test_cases:[
      { input:"0 0", output:"0" },
      { input:"1000 1000", output:"2000" }
    ],
    languages:["python","java"] },

  { type:"coding", id:"code_forl_e1", topic:"for_loops", difficulty:"easy", marks:10,
    problem_statement:"Read an integer n, then print the numbers from 1 to n each on a new line.",
    input_format:"A single integer n.",
    output_format:"n lines, the numbers 1 through n.",
    constraints:"1 <= n <= 100",
    sample_test_cases:[
      { input:"3", output:"1\n2\n3" }
    ],
    hidden_test_cases:[
      { input:"1", output:"1" },
      { input:"5", output:"1\n2\n3\n4\n5" }
    ],
    languages:["python","java"] },

  { type:"coding", id:"code_fn_e1", topic:"functions", difficulty:"medium", marks:10,
    problem_statement:"Write a function is_even(n) that returns True if n is even, False otherwise. Then read an integer and print the result.",
    input_format:"A single integer n.",
    output_format:"True or False.",
    constraints:"-10^9 <= n <= 10^9",
    sample_test_cases:[
      { input:"4", output:"True" },
      { input:"7", output:"False" }
    ],
    hidden_test_cases:[
      { input:"0", output:"True" },
      { input:"-3", output:"False" }
    ],
    languages:["python","java"] },

  { type:"coding", id:"code_rec_e1", topic:"recursion", difficulty:"medium", marks:10,
    problem_statement:"Write a recursive function factorial(n) that returns n!. Read n and print the result.",
    input_format:"A single integer n.",
    output_format:"A single integer: n!",
    constraints:"0 <= n <= 12",
    sample_test_cases:[
      { input:"5", output:"120" },
      { input:"0", output:"1" }
    ],
    hidden_test_cases:[
      { input:"3", output:"6" },
      { input:"10", output:"3628800" }
    ],
    languages:["python","java"] },

];
