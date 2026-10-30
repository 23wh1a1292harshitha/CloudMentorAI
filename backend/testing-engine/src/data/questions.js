// Question bank — topic + difficulty (easy/medium/hard) tagged.
// Topics map exactly to learningPaths.js topic ids.

const mcqQuestions = [

  // ══════════════════════════════════════════════════════════════════════════
  // PATH 1: PROGRAMMING FUNDAMENTALS
  // ══════════════════════════════════════════════════════════════════════════

  // ── variables ─────────────────────────────────────────────────────────────
  { id:"q_var_e1", topic:"variables", difficulty:"easy",
    prompt:"What is a variable?",
    options:[{id:"a",text:"A named storage location for a value"},{id:"b",text:"A type of loop"},{id:"c",text:"A function that returns nothing"},{id:"d",text:"A comment in code"}],
    correct_option_id:"a" },
  { id:"q_var_e2", topic:"variables", difficulty:"easy",
    prompt:"Which of these is a valid variable name in most languages?",
    options:[{id:"a",text:"2ndValue"},{id:"b",text:"student_score"},{id:"c",text:"student-score"},{id:"d",text:"class"}],
    correct_option_id:"b" },
  { id:"q_var_m1", topic:"variables", difficulty:"medium",
    prompt:"In Python, what is the difference between a local and a global variable?",
    options:[{id:"a",text:"Local variables are defined outside all functions"},{id:"b",text:"Local variables exist only within the function they are declared in"},{id:"c",text:"Global variables can only hold numbers"},{id:"d",text:"There is no difference in Python"}],
    correct_option_id:"b" },
  { id:"q_var_m2", topic:"variables", difficulty:"medium",
    prompt:"What does 'immutable' mean for a variable's value?",
    options:[{id:"a",text:"The value can be changed at any time"},{id:"b",text:"The value cannot be changed after it is set"},{id:"c",text:"The variable is hidden from other functions"},{id:"d",text:"The variable is deleted after use"}],
    correct_option_id:"b" },
  { id:"q_var_h1", topic:"variables", difficulty:"hard",
    prompt:"What is variable shadowing?",
    options:[{id:"a",text:"Declaring the same variable twice in the same scope"},{id:"b",text:"An inner scope variable hiding an outer scope variable with the same name"},{id:"c",text:"Using a variable before it is declared"},{id:"d",text:"Assigning None to a variable"}],
    correct_option_id:"b" },
  { id:"q_var_h2", topic:"variables", difficulty:"hard",
    prompt:"In Python, what does the 'global' keyword do inside a function?",
    options:[{id:"a",text:"Creates a new global variable automatically"},{id:"b",text:"Tells Python the variable refers to the one in global scope, not a new local one"},{id:"c",text:"Prevents the variable from being modified"},{id:"d",text:"Copies the global variable into local scope"}],
    correct_option_id:"b" },

  // ── operators ─────────────────────────────────────────────────────────────
  { id:"q_op_e1", topic:"operators", difficulty:"easy",
    prompt:"What does the % operator do in most languages?",
    options:[{id:"a",text:"Percentage calculation"},{id:"b",text:"Returns the remainder of a division"},{id:"c",text:"Divides two numbers"},{id:"d",text:"Raises a number to a power"}],
    correct_option_id:"b" },
  { id:"q_op_e2", topic:"operators", difficulty:"easy",
    prompt:"Which operator checks if two values are equal?",
    options:[{id:"a",text:"="},{id:"b",text:"=="},{id:"c",text:"==="},{id:"d",text:"!="}],
    correct_option_id:"b" },
  { id:"q_op_m1", topic:"operators", difficulty:"medium",
    prompt:"What is the result of 5 // 2 in Python?",
    options:[{id:"a",text:"2.5"},{id:"b",text:"3"},{id:"c",text:"2"},{id:"d",text:"1"}],
    correct_option_id:"c" },
  { id:"q_op_m2", topic:"operators", difficulty:"medium",
    prompt:"What does the 'not' operator do?",
    options:[{id:"a",text:"Adds two boolean values"},{id:"b",text:"Inverts a boolean value"},{id:"c",text:"Compares two values"},{id:"d",text:"Converts a value to an integer"}],
    correct_option_id:"b" },
  { id:"q_op_h1", topic:"operators", difficulty:"hard",
    prompt:"What is operator precedence?",
    options:[{id:"a",text:"The order in which operators are evaluated in an expression"},{id:"b",text:"The speed at which operators execute"},{id:"c",text:"The number of operands an operator accepts"},{id:"d",text:"Whether an operator modifies its operands"}],
    correct_option_id:"a" },
  { id:"q_op_h2", topic:"operators", difficulty:"hard",
    prompt:"In Python, what does the walrus operator := do?",
    options:[{id:"a",text:"Checks equality"},{id:"b",text:"Assigns a value and returns it within an expression"},{id:"c",text:"Compares two strings"},{id:"d",text:"Performs integer division"}],
    correct_option_id:"b" },

  // ── input_output ──────────────────────────────────────────────────────────
  { id:"q_io_e1", topic:"input_output", difficulty:"easy",
    prompt:"Which Python function reads a line of user input from the keyboard?",
    options:[{id:"a",text:"read()"},{id:"b",text:"input()"},{id:"c",text:"scan()"},{id:"d",text:"get()"}],
    correct_option_id:"b" },
  { id:"q_io_e2", topic:"input_output", difficulty:"easy",
    prompt:"Which Python function prints output to the screen?",
    options:[{id:"a",text:"display()"},{id:"b",text:"output()"},{id:"c",text:"print()"},{id:"d",text:"echo()"}],
    correct_option_id:"c" },
  { id:"q_io_m1", topic:"input_output", difficulty:"medium",
    prompt:"What does int(input()) do in Python?",
    options:[{id:"a",text:"Prints an integer"},{id:"b",text:"Reads input and converts it to an integer"},{id:"c",text:"Converts a float to int"},{id:"d",text:"Creates an integer variable"}],
    correct_option_id:"b" },
  { id:"q_io_m2", topic:"input_output", difficulty:"medium",
    prompt:"In Python, what does the sep parameter in print() control?",
    options:[{id:"a",text:"The separator between multiple arguments"},{id:"b",text:"The end character after printing"},{id:"c",text:"The file to write output to"},{id:"d",text:"The number of lines to skip"}],
    correct_option_id:"a" },
  { id:"q_io_h1", topic:"input_output", difficulty:"hard",
    prompt:"What is buffered I/O?",
    options:[{id:"a",text:"I/O that stores data temporarily before writing to improve performance"},{id:"b",text:"I/O that encrypts data before writing"},{id:"c",text:"Reading a file in reverse order"},{id:"d",text:"I/O that requires manual flushing every byte"}],
    correct_option_id:"a" },

  // ── conditions ────────────────────────────────────────────────────────────
  { id:"q_cond_e1", topic:"conditions", difficulty:"easy",
    prompt:"Which keyword starts a conditional statement in Python?",
    options:[{id:"a",text:"when"},{id:"b",text:"if"},{id:"c",text:"check"},{id:"d",text:"case"}],
    correct_option_id:"b" },
  { id:"q_cond_e2", topic:"conditions", difficulty:"easy",
    prompt:"What does 'else' do in an if-else statement?",
    options:[{id:"a",text:"Runs when the if condition is true"},{id:"b",text:"Runs when no previous condition was true"},{id:"c",text:"Repeats the if condition"},{id:"d",text:"Ends the program"}],
    correct_option_id:"b" },
  { id:"q_cond_m1", topic:"conditions", difficulty:"medium",
    prompt:"What is the purpose of 'elif' in Python?",
    options:[{id:"a",text:"It is an alias for else"},{id:"b",text:"It checks another condition only if the previous ones were false"},{id:"c",text:"It loops through conditions"},{id:"d",text:"It catches exceptions"}],
    correct_option_id:"b" },
  { id:"q_cond_m2", topic:"conditions", difficulty:"medium",
    prompt:"What does a ternary (conditional) expression do?",
    options:[{id:"a",text:"Runs a loop three times"},{id:"b",text:"Evaluates a condition and returns one of two values in one line"},{id:"c",text:"Combines three functions"},{id:"d",text:"Checks three conditions simultaneously"}],
    correct_option_id:"b" },
  { id:"q_cond_h1", topic:"conditions", difficulty:"hard",
    prompt:"What is short-circuit evaluation in logical expressions?",
    options:[{id:"a",text:"Evaluating only the minimum number of operands needed to determine the result"},{id:"b",text:"Skipping the else branch when the if is long"},{id:"c",text:"Optimising loop conditions"},{id:"d",text:"Combining multiple if statements into one"}],
    correct_option_id:"a" },

  // ── for_loops ─────────────────────────────────────────────────────────────
  { id:"q_forl_e1", topic:"for_loops", difficulty:"easy",
    prompt:"In Python, what does range(5) produce?",
    options:[{id:"a",text:"Numbers 1 to 5"},{id:"b",text:"Numbers 0 to 4"},{id:"c",text:"Numbers 0 to 5"},{id:"d",text:"Numbers 1 to 4"}],
    correct_option_id:"b" },
  { id:"q_forl_e2", topic:"for_loops", difficulty:"easy",
    prompt:"Which loop is best when you know exactly how many times to repeat?",
    options:[{id:"a",text:"for loop"},{id:"b",text:"while loop"},{id:"c",text:"do-while loop"},{id:"d",text:"switch loop"}],
    correct_option_id:"a" },
  { id:"q_forl_m1", topic:"for_loops", difficulty:"medium",
    prompt:"What does 'break' do inside a for loop?",
    options:[{id:"a",text:"Skips to the next iteration"},{id:"b",text:"Exits the loop immediately"},{id:"c",text:"Restarts the loop"},{id:"d",text:"Pauses execution"}],
    correct_option_id:"b" },
  { id:"q_forl_m2", topic:"for_loops", difficulty:"medium",
    prompt:"What does enumerate() provide when used with a for loop?",
    options:[{id:"a",text:"Only the index"},{id:"b",text:"Only the value"},{id:"c",text:"Both the index and the value"},{id:"d",text:"The length of the iterable"}],
    correct_option_id:"c" },
  { id:"q_forl_h1", topic:"for_loops", difficulty:"hard",
    prompt:"What does 'continue' do in a for loop?",
    options:[{id:"a",text:"Exits the loop"},{id:"b",text:"Skips the rest of the current iteration and moves to the next"},{id:"c",text:"Restarts the loop from the beginning"},{id:"d",text:"Ends the program"}],
    correct_option_id:"b" },

  // ── while_loops ───────────────────────────────────────────────────────────
  { id:"q_whl_e1", topic:"while_loops", difficulty:"easy",
    prompt:"What happens if a while loop's condition never becomes false?",
    options:[{id:"a",text:"It runs once and stops"},{id:"b",text:"It becomes an infinite loop"},{id:"c",text:"It throws a syntax error"},{id:"d",text:"It skips to the next line"}],
    correct_option_id:"b" },
  { id:"q_whl_e2", topic:"while_loops", difficulty:"easy",
    prompt:"When is a while loop preferred over a for loop?",
    options:[{id:"a",text:"When the number of iterations is unknown in advance"},{id:"b",text:"When iterating over a list"},{id:"c",text:"When you need an index"},{id:"d",text:"When the loop runs exactly 10 times"}],
    correct_option_id:"a" },
  { id:"q_whl_m1", topic:"while_loops", difficulty:"medium",
    prompt:"What is a do-while loop equivalent in Python?",
    options:[{id:"a",text:"Python has a native do-while"},{id:"b",text:"while True: ... with a break at the end of the body"},{id:"c",text:"for _ in range(1): ..."},{id:"d",text:"loop: ... until condition"}],
    correct_option_id:"b" },
  { id:"q_whl_m2", topic:"while_loops", difficulty:"medium",
    prompt:"What is a sentinel value in the context of a while loop?",
    options:[{id:"a",text:"A variable that counts iterations"},{id:"b",text:"A special value that signals the loop to stop"},{id:"c",text:"The first value processed by the loop"},{id:"d",text:"A variable that stores the loop condition"}],
    correct_option_id:"b" },
  { id:"q_whl_h1", topic:"while_loops", difficulty:"hard",
    prompt:"What is an off-by-one error?",
    options:[{id:"a",text:"Using the wrong operator in a condition"},{id:"b",text:"A loop running one iteration too many or too few"},{id:"c",text:"Forgetting to initialise a variable"},{id:"d",text:"Using a while loop instead of for"}],
    correct_option_id:"b" },

  // ── nested_loops ──────────────────────────────────────────────────────────
  { id:"q_nlp_e1", topic:"nested_loops", difficulty:"easy",
    prompt:"What is a nested loop?",
    options:[{id:"a",text:"A loop inside another loop"},{id:"b",text:"A loop that calls itself"},{id:"c",text:"A loop with two conditions"},{id:"d",text:"A loop that runs in parallel"}],
    correct_option_id:"a" },
  { id:"q_nlp_e2", topic:"nested_loops", difficulty:"easy",
    prompt:"How many times does the inner loop body run if outer runs 3 times and inner runs 4 times?",
    options:[{id:"a",text:"3"},{id:"b",text:"4"},{id:"c",text:"7"},{id:"d",text:"12"}],
    correct_option_id:"d" },
  { id:"q_nlp_m1", topic:"nested_loops", difficulty:"medium",
    prompt:"What is the time complexity of two nested loops each iterating n times?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(n log n)"},{id:"c",text:"O(n²)"},{id:"d",text:"O(2n)"}],
    correct_option_id:"c" },
  { id:"q_nlp_m2", topic:"nested_loops", difficulty:"medium",
    prompt:"In a nested loop, what does 'break' affect?",
    options:[{id:"a",text:"Both loops"},{id:"b",text:"Only the innermost loop"},{id:"c",text:"Only the outermost loop"},{id:"d",text:"All loops in the program"}],
    correct_option_id:"b" },
  { id:"q_nlp_h1", topic:"nested_loops", difficulty:"hard",
    prompt:"How would you print a right-angled triangle of stars with n rows using nested loops?",
    options:[{id:"a",text:"for i in range(n): print('*' * (n - i))"},{id:"b",text:"for i in range(1, n+1): for j in range(i): print('*', end=''); print()"},{id:"c",text:"for i in range(n): print('*')"},{id:"d",text:"while n > 0: print('*' * n); n -= 1"}],
    correct_option_id:"b" },

  // ── number_patterns ───────────────────────────────────────────────────────
  { id:"q_nump_e1", topic:"number_patterns", difficulty:"easy",
    prompt:"Which Python construct is most used to print number patterns?",
    options:[{id:"a",text:"Recursion"},{id:"b",text:"Nested loops"},{id:"c",text:"List comprehensions"},{id:"d",text:"Dictionaries"}],
    correct_option_id:"b" },
  { id:"q_nump_e2", topic:"number_patterns", difficulty:"easy",
    prompt:"What does range(1, 6) return?",
    options:[{id:"a",text:"1 2 3 4 5 6"},{id:"b",text:"1 2 3 4 5"},{id:"c",text:"0 1 2 3 4 5"},{id:"d",text:"1 2 3 4"}],
    correct_option_id:"b" },
  { id:"q_nump_m1", topic:"number_patterns", difficulty:"medium",
    prompt:"To print: 1 / 1 2 / 1 2 3, which loop variable controls the row number?",
    options:[{id:"a",text:"Inner loop variable"},{id:"b",text:"Outer loop variable"},{id:"c",text:"A separate counter"},{id:"d",text:"The range limit"}],
    correct_option_id:"b" },
  { id:"q_nump_m2", topic:"number_patterns", difficulty:"medium",
    prompt:"What change produces: 1 / 2 3 / 4 5 6 (each row has row number of elements starting from where last row ended)?",
    options:[{id:"a",text:"Reset count to 1 every row"},{id:"b",text:"Carry a global counter that increments each iteration"},{id:"c",text:"Multiply row number by column number"},{id:"d",text:"Use a single loop"}],
    correct_option_id:"b" },
  { id:"q_nump_h1", topic:"number_patterns", difficulty:"hard",
    prompt:"Floyd's triangle prints natural numbers row by row. What is the last number in row n?",
    options:[{id:"a",text:"n"},{id:"b",text:"n*(n+1)/2"},{id:"c",text:"n²"},{id:"d",text:"n*(n-1)/2"}],
    correct_option_id:"b" },

  // ── star_patterns ─────────────────────────────────────────────────────────
  { id:"q_starp_e1", topic:"star_patterns", difficulty:"easy",
    prompt:"Which print() call produces stars without a newline after each star?",
    options:[{id:"a",text:"print('*')"},{id:"b",text:"print('*', end='')"},{id:"c",text:"print('*', sep='')"},{id:"d",text:"print('*', newline=False)"}],
    correct_option_id:"b" },
  { id:"q_starp_e2", topic:"star_patterns", difficulty:"easy",
    prompt:"What does print('*' * 5) output?",
    options:[{id:"a",text:"* * * * *"},{id:"b",text:"*****"},{id:"c",text:"*5"},{id:"d",text:"5*"}],
    correct_option_id:"b" },
  { id:"q_starp_m1", topic:"star_patterns", difficulty:"medium",
    prompt:"To print an inverted triangle with n rows, how does the number of stars change per row?",
    options:[{id:"a",text:"Increases by 1"},{id:"b",text:"Stays the same"},{id:"c",text:"Decreases by 1"},{id:"d",text:"Doubles each row"}],
    correct_option_id:"c" },
  { id:"q_starp_m2", topic:"star_patterns", difficulty:"medium",
    prompt:"To centre-align a pyramid pattern, what is added before each row of stars?",
    options:[{id:"a",text:"Nothing"},{id:"b",text:"Leading spaces"},{id:"c",text:"Trailing stars"},{id:"d",text:"Tab characters"}],
    correct_option_id:"b" },
  { id:"q_starp_h1", topic:"star_patterns", difficulty:"hard",
    prompt:"What is the number of stars in the middle row of a diamond pattern with n odd rows?",
    options:[{id:"a",text:"n"},{id:"b",text:"n//2 + 1"},{id:"c",text:"(n+1)//2 * 2 - 1"},{id:"d",text:"n - 1"}],
    correct_option_id:"c" },

  // ── functions ─────────────────────────────────────────────────────────────
  { id:"q_fn_e1", topic:"functions", difficulty:"easy",
    prompt:"Why do we use functions in code?",
    options:[{id:"a",text:"To repeat and reuse a block of logic"},{id:"b",text:"To make code run slower"},{id:"c",text:"To delete variables"},{id:"d",text:"To add comments automatically"}],
    correct_option_id:"a" },
  { id:"q_fn_e2", topic:"functions", difficulty:"easy",
    prompt:"What does 'return' do inside a function?",
    options:[{id:"a",text:"Deletes the function"},{id:"b",text:"Sends a value back to the caller"},{id:"c",text:"Starts a loop"},{id:"d",text:"Prints a value to the screen"}],
    correct_option_id:"b" },
  { id:"q_fn_m1", topic:"functions", difficulty:"medium",
    prompt:"What is a default parameter in a function?",
    options:[{id:"a",text:"A parameter that must always be provided"},{id:"b",text:"A parameter with a pre-set value used when no argument is passed"},{id:"c",text:"The first parameter of any function"},{id:"d",text:"A parameter that accepts any data type"}],
    correct_option_id:"b" },
  { id:"q_fn_m2", topic:"functions", difficulty:"medium",
    prompt:"What is a higher-order function?",
    options:[{id:"a",text:"A function with more than 5 parameters"},{id:"b",text:"A function that takes another function as an argument or returns one"},{id:"c",text:"A function defined inside a class"},{id:"d",text:"A function that runs faster than normal"}],
    correct_option_id:"b" },
  { id:"q_fn_h1", topic:"functions", difficulty:"hard",
    prompt:"What is a closure in programming?",
    options:[{id:"a",text:"A function that cannot be called more than once"},{id:"b",text:"A function that captures variables from its enclosing scope"},{id:"c",text:"A function with no return value"},{id:"d",text:"A function that deletes itself after running"}],
    correct_option_id:"b" },
  { id:"q_fn_h2", topic:"functions", difficulty:"hard",
    prompt:"What does a decorator do in Python?",
    options:[{id:"a",text:"Adds styling to print output"},{id:"b",text:"Wraps a function to extend its behaviour without modifying it directly"},{id:"c",text:"Converts a function to a class"},{id:"d",text:"Prevents recursion"}],
    correct_option_id:"b" },

  // ── arrays_lists ──────────────────────────────────────────────────────────
  { id:"q_arr_e1", topic:"arrays_lists", difficulty:"easy",
    prompt:"What is a list in Python?",
    options:[{id:"a",text:"An ordered, mutable collection of items"},{id:"b",text:"An unordered set of unique items"},{id:"c",text:"A fixed-size array"},{id:"d",text:"A key-value store"}],
    correct_option_id:"a" },
  { id:"q_arr_e2", topic:"arrays_lists", difficulty:"easy",
    prompt:"How do you access the last element of a list in Python?",
    options:[{id:"a",text:"list[last]"},{id:"b",text:"list[-1]"},{id:"c",text:"list[end]"},{id:"d",text:"list.last()"}],
    correct_option_id:"b" },
  { id:"q_arr_m1", topic:"arrays_lists", difficulty:"medium",
    prompt:"What is the time complexity of inserting an element at the beginning of a Python list?",
    options:[{id:"a",text:"O(1)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(n)"},{id:"d",text:"O(n²)"}],
    correct_option_id:"c" },
  { id:"q_arr_m2", topic:"arrays_lists", difficulty:"medium",
    prompt:"What does list slicing list[1:4] return?",
    options:[{id:"a",text:"Elements at index 1, 2, 3, 4"},{id:"b",text:"Elements at index 1, 2, 3"},{id:"c",text:"Elements at index 0, 1, 2, 3"},{id:"d",text:"Elements from index 4 onwards"}],
    correct_option_id:"b" },
  { id:"q_arr_h1", topic:"arrays_lists", difficulty:"hard",
    prompt:"What is the difference between a shallow copy and a deep copy of a list?",
    options:[{id:"a",text:"Shallow copies the structure but not nested objects; deep copies everything"},{id:"b",text:"Deep copy is faster than shallow copy"},{id:"c",text:"Shallow copy copies nested objects; deep copy does not"},{id:"d",text:"They are the same for lists"}],
    correct_option_id:"a" },

  // ── strings ───────────────────────────────────────────────────────────────
  { id:"q_str_e1", topic:"strings", difficulty:"easy",
    prompt:"In Python, are strings mutable?",
    options:[{id:"a",text:"Yes, you can change individual characters"},{id:"b",text:"No, strings are immutable"},{id:"c",text:"Only if declared with 'var'"},{id:"d",text:"Only for short strings"}],
    correct_option_id:"b" },
  { id:"q_str_e2", topic:"strings", difficulty:"easy",
    prompt:"Which method converts a string to uppercase in Python?",
    options:[{id:"a",text:".upper()"},{id:"b",text:".toUpper()"},{id:"c",text:".capitalize()"},{id:"d",text:".UP()"}],
    correct_option_id:"a" },
  { id:"q_str_m1", topic:"strings", difficulty:"medium",
    prompt:"What does 'hello'.split('l') return?",
    options:[{id:"a",text:"['he', 'o']"},{id:"b",text:"['he', '', 'o']"},{id:"c",text:"['h', 'e', 'l', 'l', 'o']"},{id:"d",text:"['hello']"}],
    correct_option_id:"b" },
  { id:"q_str_m2", topic:"strings", difficulty:"medium",
    prompt:"What is an f-string in Python?",
    options:[{id:"a",text:"A string that starts with 'f' by convention"},{id:"b",text:"A formatted string literal that embeds expressions inside {}"},{id:"c",text:"A string stored in a file"},{id:"d",text:"A fixed-length string"}],
    correct_option_id:"b" },
  { id:"q_str_h1", topic:"strings", difficulty:"hard",
    prompt:"What is the time complexity of concatenating n strings of average length m using +?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(n*m)"},{id:"c",text:"O(n²*m)"},{id:"d",text:"O(m)"}],
    correct_option_id:"c" },

  // ── recursion ─────────────────────────────────────────────────────────────
  { id:"q_rec_e1", topic:"recursion", difficulty:"easy",
    prompt:"What causes a RecursionError in Python?",
    options:[{id:"a",text:"The function runs too fast"},{id:"b",text:"The base case is never reached"},{id:"c",text:"Too many print statements"},{id:"d",text:"A missing import"}],
    correct_option_id:"b" },
  { id:"q_rec_e2", topic:"recursion", difficulty:"easy",
    prompt:"What does a base case do in recursion?",
    options:[{id:"a",text:"Stops the recursive calls"},{id:"b",text:"Starts the loop"},{id:"c",text:"Imports a library"},{id:"d",text:"Declares a variable"}],
    correct_option_id:"a" },
  { id:"q_rec_m1", topic:"recursion", difficulty:"medium",
    prompt:"factorial(n) calls itself with which argument?",
    options:[{id:"a",text:"factorial(n)"},{id:"b",text:"factorial(n+1)"},{id:"c",text:"factorial(n-1)"},{id:"d",text:"factorial(0)"}],
    correct_option_id:"c" },
  { id:"q_rec_m2", topic:"recursion", difficulty:"medium",
    prompt:"Which is a correct base case for recursive list sum?",
    options:[{id:"a",text:"if len(lst)==1: return lst[0]"},{id:"b",text:"if lst: return 0"},{id:"c",text:"if len(lst)==0: return 0"},{id:"d",text:"if lst[0]>0: return lst[0]"}],
    correct_option_id:"c" },
  { id:"q_rec_h1", topic:"recursion", difficulty:"hard",
    prompt:"Time complexity of naive recursive Fibonacci?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(n log n)"},{id:"c",text:"O(2^n)"},{id:"d",text:"O(n²)"}],
    correct_option_id:"c" },
  { id:"q_rec_h2", topic:"recursion", difficulty:"hard",
    prompt:"Tail recursion is preferred because:",
    options:[{id:"a",text:"It is easier to read"},{id:"b",text:"Compilers can optimise it into a loop, avoiding stack growth"},{id:"c",text:"It always runs faster"},{id:"d",text:"It removes the need for a base case"}],
    correct_option_id:"b" },

  // ══════════════════════════════════════════════════════════════════════════
  // PATH 2: WEB DEVELOPMENT
  // ══════════════════════════════════════════════════════════════════════════

  // ── html_basics ───────────────────────────────────────────────────────────
  { id:"q_html_e1", topic:"html_basics", difficulty:"easy",
    prompt:"What does HTML stand for?",
    options:[{id:"a",text:"HyperText Markup Language"},{id:"b",text:"HighText Machine Language"},{id:"c",text:"Hyperlink and Text Markup Language"},{id:"d",text:"HyperText Modeling Language"}],
    correct_option_id:"a" },
  { id:"q_html_e2", topic:"html_basics", difficulty:"easy",
    prompt:"Which HTML tag creates a hyperlink?",
    options:[{id:"a",text:"<link>"},{id:"b",text:"<a>"},{id:"c",text:"<href>"},{id:"d",text:"<url>"}],
    correct_option_id:"b" },
  { id:"q_html_m1", topic:"html_basics", difficulty:"medium",
    prompt:"What is the difference between block-level and inline elements?",
    options:[{id:"a",text:"Block elements take full width; inline elements only take content width"},{id:"b",text:"Block elements are invisible; inline are visible"},{id:"c",text:"Inline elements are always bold"},{id:"d",text:"Block elements cannot be styled"}],
    correct_option_id:"a" },
  { id:"q_html_m2", topic:"html_basics", difficulty:"medium",
    prompt:"What is the purpose of the <meta charset='UTF-8'> tag?",
    options:[{id:"a",text:"Sets the page language to UTF-8"},{id:"b",text:"Declares the character encoding for the HTML document"},{id:"c",text:"Imports a UTF-8 font"},{id:"d",text:"Defines the page title"}],
    correct_option_id:"b" },
  { id:"q_html_h1", topic:"html_basics", difficulty:"hard",
    prompt:"What is semantic HTML?",
    options:[{id:"a",text:"HTML that uses only <div> and <span>"},{id:"b",text:"HTML that uses elements conveying meaning about the content"},{id:"c",text:"HTML without CSS"},{id:"d",text:"HTML validated by W3C"}],
    correct_option_id:"b" },

  // ── css_basics ────────────────────────────────────────────────────────────
  { id:"q_css_e1", topic:"css_basics", difficulty:"easy",
    prompt:"What does CSS stand for?",
    options:[{id:"a",text:"Creative Style Sheets"},{id:"b",text:"Cascading Style Sheets"},{id:"c",text:"Computer Style Sheets"},{id:"d",text:"Colorful Style Sheets"}],
    correct_option_id:"b" },
  { id:"q_css_e2", topic:"css_basics", difficulty:"easy",
    prompt:"Which CSS property changes the text colour?",
    options:[{id:"a",text:"font-color"},{id:"b",text:"text-color"},{id:"c",text:"color"},{id:"d",text:"foreground"}],
    correct_option_id:"c" },
  { id:"q_css_m1", topic:"css_basics", difficulty:"medium",
    prompt:"What is the CSS Box Model?",
    options:[{id:"a",text:"A 3D rendering model"},{id:"b",text:"Content, padding, border, and margin surrounding every element"},{id:"c",text:"A grid layout system"},{id:"d",text:"A model for responsive design"}],
    correct_option_id:"b" },
  { id:"q_css_m2", topic:"css_basics", difficulty:"medium",
    prompt:"What is the difference between class and id selectors?",
    options:[{id:"a",text:"id can be reused; class must be unique"},{id:"b",text:"class can be reused; id must be unique per page"},{id:"c",text:"They are identical"},{id:"d",text:"id applies to block elements only"}],
    correct_option_id:"b" },
  { id:"q_css_h1", topic:"css_basics", difficulty:"hard",
    prompt:"What is CSS specificity?",
    options:[{id:"a",text:"The order rules appear in a stylesheet"},{id:"b",text:"A weight system determining which CSS rule applies when multiple rules match"},{id:"c",text:"The number of selectors in a rule"},{id:"d",text:"The browser's default stylesheet"}],
    correct_option_id:"b" },

  // ── responsive_design ─────────────────────────────────────────────────────
  { id:"q_resp_e1", topic:"responsive_design", difficulty:"easy",
    prompt:"What is a media query in CSS?",
    options:[{id:"a",text:"A JavaScript function for screen size"},{id:"b",text:"A CSS rule that applies styles based on device characteristics"},{id:"c",text:"A HTML tag for images"},{id:"d",text:"A server-side script"}],
    correct_option_id:"b" },
  { id:"q_resp_e2", topic:"responsive_design", difficulty:"easy",
    prompt:"What does 'mobile-first' mean in web design?",
    options:[{id:"a",text:"Building only for mobile devices"},{id:"b",text:"Designing for mobile screens first, then scaling up"},{id:"c",text:"Using mobile frameworks exclusively"},{id:"d",text:"Testing on mobile before desktop"}],
    correct_option_id:"b" },
  { id:"q_resp_m1", topic:"responsive_design", difficulty:"medium",
    prompt:"What CSS unit is relative to the viewport width?",
    options:[{id:"a",text:"px"},{id:"b",text:"em"},{id:"c",text:"vw"},{id:"d",text:"pt"}],
    correct_option_id:"c" },
  { id:"q_resp_m2", topic:"responsive_design", difficulty:"medium",
    prompt:"What is the purpose of the meta viewport tag?",
    options:[{id:"a",text:"Sets the page background color"},{id:"b",text:"Controls how the browser scales the page on mobile devices"},{id:"c",text:"Imports responsive CSS"},{id:"d",text:"Defines the screen resolution"}],
    correct_option_id:"b" },
  { id:"q_resp_h1", topic:"responsive_design", difficulty:"hard",
    prompt:"What is a CSS Grid vs Flexbox difference in one sentence?",
    options:[{id:"a",text:"Grid is for 2D layouts; Flexbox is for 1D (row or column)"},{id:"b",text:"Flexbox is for 2D; Grid is for 1D"},{id:"c",text:"They are identical"},{id:"d",text:"Grid only works in Chrome"}],
    correct_option_id:"a" },

  // ── javascript_fundamentals ───────────────────────────────────────────────
  { id:"q_js_e1", topic:"javascript_fundamentals", difficulty:"easy",
    prompt:"Which keyword declares a block-scoped variable in modern JavaScript?",
    options:[{id:"a",text:"var"},{id:"b",text:"let"},{id:"c",text:"dim"},{id:"d",text:"define"}],
    correct_option_id:"b" },
  { id:"q_js_e2", topic:"javascript_fundamentals", difficulty:"easy",
    prompt:"What does typeof null return in JavaScript?",
    options:[{id:"a",text:"'null'"},{id:"b",text:"'undefined'"},{id:"c",text:"'object'"},{id:"d",text:"'number'"}],
    correct_option_id:"c" },
  { id:"q_js_m1", topic:"javascript_fundamentals", difficulty:"medium",
    prompt:"What is the difference between == and === in JavaScript?",
    options:[{id:"a",text:"== is stricter than ==="},{id:"b",text:"=== checks value and type; == only checks value with type coercion"},{id:"c",text:"They are identical"},{id:"d",text:"=== is deprecated"}],
    correct_option_id:"b" },
  { id:"q_js_m2", topic:"javascript_fundamentals", difficulty:"medium",
    prompt:"What is a Promise in JavaScript?",
    options:[{id:"a",text:"A synchronous function"},{id:"b",text:"An object representing an eventual result of an asynchronous operation"},{id:"c",text:"A way to declare constants"},{id:"d",text:"A loop construct"}],
    correct_option_id:"b" },
  { id:"q_js_h1", topic:"javascript_fundamentals", difficulty:"hard",
    prompt:"What is event bubbling in JavaScript?",
    options:[{id:"a",text:"Events propagating from the target element up through its ancestors"},{id:"b",text:"Events propagating from parent to child"},{id:"c",text:"Multiple events firing simultaneously"},{id:"d",text:"Events being prevented from firing"}],
    correct_option_id:"a" },

  // ── dom_manipulation ──────────────────────────────────────────────────────
  { id:"q_dom_e1", topic:"dom_manipulation", difficulty:"easy",
    prompt:"What does DOM stand for?",
    options:[{id:"a",text:"Document Object Model"},{id:"b",text:"Data Object Manager"},{id:"c",text:"Dynamic Output Model"},{id:"d",text:"Document Oriented Markup"}],
    correct_option_id:"a" },
  { id:"q_dom_e2", topic:"dom_manipulation", difficulty:"easy",
    prompt:"Which method selects an element by its id?",
    options:[{id:"a",text:"document.getElement()"},{id:"b",text:"document.getElementById()"},{id:"c",text:"document.select()"},{id:"d",text:"document.findById()"}],
    correct_option_id:"b" },
  { id:"q_dom_m1", topic:"dom_manipulation", difficulty:"medium",
    prompt:"What is the difference between innerHTML and textContent?",
    options:[{id:"a",text:"textContent parses HTML; innerHTML does not"},{id:"b",text:"innerHTML parses HTML tags; textContent sets plain text only"},{id:"c",text:"They are identical"},{id:"d",text:"innerHTML is read-only"}],
    correct_option_id:"b" },
  { id:"q_dom_m2", topic:"dom_manipulation", difficulty:"medium",
    prompt:"What does event.preventDefault() do?",
    options:[{id:"a",text:"Stops event bubbling"},{id:"b",text:"Prevents the browser's default action for the event"},{id:"c",text:"Removes the event listener"},{id:"d",text:"Disables the element"}],
    correct_option_id:"b" },
  { id:"q_dom_h1", topic:"dom_manipulation", difficulty:"hard",
    prompt:"What is event delegation?",
    options:[{id:"a",text:"Attaching a listener to a parent to handle events on its children"},{id:"b",text:"Passing events between windows"},{id:"c",text:"Using only one event listener per page"},{id:"d",text:"Delegating events to the server"}],
    correct_option_id:"a" },

  // ── rest_api_basics ───────────────────────────────────────────────────────
  { id:"q_rest_e1", topic:"rest_api_basics", difficulty:"easy",
    prompt:"What does REST stand for?",
    options:[{id:"a",text:"Rapid Execution Standard Technology"},{id:"b",text:"Representational State Transfer"},{id:"c",text:"Remote Service Transaction"},{id:"d",text:"Resource Endpoint Standard Tool"}],
    correct_option_id:"b" },
  { id:"q_rest_e2", topic:"rest_api_basics", difficulty:"easy",
    prompt:"Which HTTP method is used to retrieve data?",
    options:[{id:"a",text:"POST"},{id:"b",text:"PUT"},{id:"c",text:"GET"},{id:"d",text:"DELETE"}],
    correct_option_id:"c" },
  { id:"q_rest_m1", topic:"rest_api_basics", difficulty:"medium",
    prompt:"What does HTTP status code 404 mean?",
    options:[{id:"a",text:"Server error"},{id:"b",text:"Unauthorized"},{id:"c",text:"Resource not found"},{id:"d",text:"Request successful"}],
    correct_option_id:"c" },
  { id:"q_rest_m2", topic:"rest_api_basics", difficulty:"medium",
    prompt:"What is JSON and why is it used in REST APIs?",
    options:[{id:"a",text:"A JavaScript framework"},{id:"b",text:"A lightweight text format for data exchange, easy to parse in any language"},{id:"c",text:"A database query language"},{id:"d",text:"A type of HTTP method"}],
    correct_option_id:"b" },
  { id:"q_rest_h1", topic:"rest_api_basics", difficulty:"hard",
    prompt:"What makes an API truly RESTful according to Richardson Maturity Model Level 3?",
    options:[{id:"a",text:"Using JSON responses"},{id:"b",text:"Having a single endpoint"},{id:"c",text:"Including hypermedia controls (HATEOAS) in responses"},{id:"d",text:"Using HTTPS"}],
    correct_option_id:"c" },


  // ══════════════════════════════════════════════════════════════════════════
  // PATH 3: DATABASE MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // ── dbms_fundamentals ─────────────────────────────────────────────────────
  { id:"q_dbms_e1", topic:"dbms_fundamentals", difficulty:"easy",
    prompt:"What is a DBMS?",
    options:[{id:"a",text:"A software system for managing databases"},{id:"b",text:"A database markup language"},{id:"c",text:"A type of network protocol"},{id:"d",text:"A hardware device for storage"}],
    correct_option_id:"a" },
  { id:"q_dbms_e2", topic:"dbms_fundamentals", difficulty:"easy",
    prompt:"What is the difference between a database and a DBMS?",
    options:[{id:"a",text:"They are the same thing"},{id:"b",text:"A database stores data; a DBMS is software to manage that data"},{id:"c",text:"A DBMS stores data; a database manages it"},{id:"d",text:"A database is a type of DBMS"}],
    correct_option_id:"b" },
  { id:"q_dbms_m1", topic:"dbms_fundamentals", difficulty:"medium",
    prompt:"What is data integrity in a DBMS?",
    options:[{id:"a",text:"The speed of data retrieval"},{id:"b",text:"Ensuring data is accurate, consistent, and reliable"},{id:"c",text:"The physical storage of data"},{id:"d",text:"Encrypting data at rest"}],
    correct_option_id:"b" },
  { id:"q_dbms_m2", topic:"dbms_fundamentals", difficulty:"medium",
    prompt:"What is the difference between a relational and non-relational database?",
    options:[{id:"a",text:"Relational stores structured data in tables; non-relational uses flexible formats"},{id:"b",text:"Non-relational is always faster"},{id:"c",text:"Relational databases cannot handle large data"},{id:"d",text:"They are identical"}],
    correct_option_id:"a" },
  { id:"q_dbms_h1", topic:"dbms_fundamentals", difficulty:"hard",
    prompt:"What are the ACID properties?",
    options:[{id:"a",text:"Access, Control, Integrity, Durability"},{id:"b",text:"Atomicity, Consistency, Isolation, Durability"},{id:"c",text:"Availability, Consistency, Integrity, Distribution"},{id:"d",text:"Atomicity, Concurrency, Indexing, Durability"}],
    correct_option_id:"b" },

  // ── tables_keys ───────────────────────────────────────────────────────────
  { id:"q_tkey_e1", topic:"tables_keys", difficulty:"easy",
    prompt:"What is a primary key?",
    options:[{id:"a",text:"The first column in any table"},{id:"b",text:"A column or set of columns that uniquely identifies each row"},{id:"c",text:"A key used for encryption"},{id:"d",text:"The most important column in the database"}],
    correct_option_id:"b" },
  { id:"q_tkey_e2", topic:"tables_keys", difficulty:"easy",
    prompt:"What is a foreign key?",
    options:[{id:"a",text:"A key from a different database"},{id:"b",text:"A column that references a primary key in another table"},{id:"c",text:"An encrypted primary key"},{id:"d",text:"A key used for sorting"}],
    correct_option_id:"b" },
  { id:"q_tkey_m1", topic:"tables_keys", difficulty:"medium",
    prompt:"What does a UNIQUE constraint ensure?",
    options:[{id:"a",text:"All values in a column are not null"},{id:"b",text:"All values in a column are distinct"},{id:"c",text:"A column is the primary key"},{id:"d",text:"A column is indexed"}],
    correct_option_id:"b" },
  { id:"q_tkey_m2", topic:"tables_keys", difficulty:"medium",
    prompt:"What is referential integrity?",
    options:[{id:"a",text:"Ensuring all primary keys are integers"},{id:"b",text:"Ensuring foreign key values match existing primary key values"},{id:"c",text:"Preventing NULL values"},{id:"d",text:"Ensuring column names are unique"}],
    correct_option_id:"b" },
  { id:"q_tkey_h1", topic:"tables_keys", difficulty:"hard",
    prompt:"What is the difference between a natural key and a surrogate key?",
    options:[{id:"a",text:"Natural key is auto-generated; surrogate comes from the data"},{id:"b",text:"Natural key has meaning in the real world; surrogate is an artificial identifier"},{id:"c",text:"They are identical"},{id:"d",text:"Surrogate keys are always strings"}],
    correct_option_id:"b" },

  // ── sql_basics ────────────────────────────────────────────────────────────
  { id:"q_sql_e1", topic:"sql_basics", difficulty:"easy",
    prompt:"Which SQL statement retrieves data from a table?",
    options:[{id:"a",text:"GET"},{id:"b",text:"FETCH"},{id:"c",text:"SELECT"},{id:"d",text:"RETRIEVE"}],
    correct_option_id:"c" },
  { id:"q_sql_e2", topic:"sql_basics", difficulty:"easy",
    prompt:"Which SQL statement adds a new row to a table?",
    options:[{id:"a",text:"ADD"},{id:"b",text:"INSERT INTO"},{id:"c",text:"PUT"},{id:"d",text:"APPEND"}],
    correct_option_id:"b" },
  { id:"q_sql_m1", topic:"sql_basics", difficulty:"medium",
    prompt:"What is the difference between DELETE and DROP?",
    options:[{id:"a",text:"DELETE removes rows; DROP removes the table structure"},{id:"b",text:"DROP removes rows; DELETE removes the table"},{id:"c",text:"They are identical"},{id:"d",text:"DELETE is for columns; DROP is for rows"}],
    correct_option_id:"a" },
  { id:"q_sql_m2", topic:"sql_basics", difficulty:"medium",
    prompt:"What does SELECT DISTINCT do?",
    options:[{id:"a",text:"Selects the first distinct column"},{id:"b",text:"Returns only unique values, eliminating duplicates"},{id:"c",text:"Sorts results alphabetically"},{id:"d",text:"Selects rows with non-null values"}],
    correct_option_id:"b" },
  { id:"q_sql_h1", topic:"sql_basics", difficulty:"hard",
    prompt:"What is a subquery?",
    options:[{id:"a",text:"A query that runs before the main query"},{id:"b",text:"A query nested inside another SQL query"},{id:"c",text:"A stored procedure"},{id:"d",text:"A query on a view"}],
    correct_option_id:"b" },

  // ── filtering_sorting ─────────────────────────────────────────────────────
  { id:"q_fs_e1", topic:"filtering_sorting", difficulty:"easy",
    prompt:"Which SQL clause filters rows based on a condition?",
    options:[{id:"a",text:"FILTER"},{id:"b",text:"WHERE"},{id:"c",text:"HAVING"},{id:"d",text:"LIMIT"}],
    correct_option_id:"b" },
  { id:"q_fs_e2", topic:"filtering_sorting", difficulty:"easy",
    prompt:"Which SQL clause sorts results?",
    options:[{id:"a",text:"SORT BY"},{id:"b",text:"GROUP BY"},{id:"c",text:"ORDER BY"},{id:"d",text:"ARRANGE BY"}],
    correct_option_id:"c" },
  { id:"q_fs_m1", topic:"filtering_sorting", difficulty:"medium",
    prompt:"What is the difference between WHERE and HAVING?",
    options:[{id:"a",text:"WHERE filters individual rows; HAVING filters groups after GROUP BY"},{id:"b",text:"HAVING filters rows; WHERE filters groups"},{id:"c",text:"They are identical"},{id:"d",text:"WHERE is for strings; HAVING is for numbers"}],
    correct_option_id:"a" },
  { id:"q_fs_m2", topic:"filtering_sorting", difficulty:"medium",
    prompt:"What does LIKE '%son' match?",
    options:[{id:"a",text:"Strings starting with 'son'"},{id:"b",text:"Strings ending with 'son'"},{id:"c",text:"Strings containing 'son'"},{id:"d",text:"Strings equal to 'son'"}],
    correct_option_id:"b" },
  { id:"q_fs_h1", topic:"filtering_sorting", difficulty:"hard",
    prompt:"What does the BETWEEN operator do?",
    options:[{id:"a",text:"Checks if a value is in a list"},{id:"b",text:"Checks if a value is within a range (inclusive)"},{id:"c",text:"Checks if a value is NULL"},{id:"d",text:"Joins two tables"}],
    correct_option_id:"b" },

  // ── aggregate_functions ───────────────────────────────────────────────────
  { id:"q_agg_e1", topic:"aggregate_functions", difficulty:"easy",
    prompt:"Which aggregate function counts the number of rows?",
    options:[{id:"a",text:"SUM()"},{id:"b",text:"COUNT()"},{id:"c",text:"TOTAL()"},{id:"d",text:"NUM()"}],
    correct_option_id:"b" },
  { id:"q_agg_e2", topic:"aggregate_functions", difficulty:"easy",
    prompt:"Which function returns the highest value in a column?",
    options:[{id:"a",text:"TOP()"},{id:"b",text:"GREATEST()"},{id:"c",text:"MAX()"},{id:"d",text:"HIGH()"}],
    correct_option_id:"c" },
  { id:"q_agg_m1", topic:"aggregate_functions", difficulty:"medium",
    prompt:"What does GROUP BY do in SQL?",
    options:[{id:"a",text:"Sorts the result set"},{id:"b",text:"Groups rows sharing a value so aggregate functions apply per group"},{id:"c",text:"Filters rows"},{id:"d",text:"Joins tables"}],
    correct_option_id:"b" },
  { id:"q_agg_m2", topic:"aggregate_functions", difficulty:"medium",
    prompt:"What does AVG() ignore when calculating the average?",
    options:[{id:"a",text:"Zero values"},{id:"b",text:"NULL values"},{id:"c",text:"Negative values"},{id:"d",text:"Duplicate values"}],
    correct_option_id:"b" },
  { id:"q_agg_h1", topic:"aggregate_functions", difficulty:"hard",
    prompt:"What is a window function in SQL?",
    options:[{id:"a",text:"A function that operates only on the first row"},{id:"b",text:"A function that performs calculations across a set of rows related to the current row without collapsing them"},{id:"c",text:"A function that opens a new database window"},{id:"d",text:"An aggregate that only works with GROUP BY"}],
    correct_option_id:"b" },

  // ── joins ─────────────────────────────────────────────────────────────────
  { id:"q_join_e1", topic:"joins", difficulty:"easy",
    prompt:"What does an INNER JOIN return?",
    options:[{id:"a",text:"All rows from both tables"},{id:"b",text:"Only rows with matching values in both tables"},{id:"c",text:"All rows from the left table"},{id:"d",text:"All rows from the right table"}],
    correct_option_id:"b" },
  { id:"q_join_e2", topic:"joins", difficulty:"easy",
    prompt:"What does a LEFT JOIN return?",
    options:[{id:"a",text:"Only matching rows"},{id:"b",text:"All rows from the left table and matching rows from the right"},{id:"c",text:"All rows from both tables"},{id:"d",text:"Rows only from the right table"}],
    correct_option_id:"b" },
  { id:"q_join_m1", topic:"joins", difficulty:"medium",
    prompt:"What is a FULL OUTER JOIN?",
    options:[{id:"a",text:"All rows from both tables, with NULLs where there is no match"},{id:"b",text:"Only matching rows"},{id:"c",text:"All rows from the left table only"},{id:"d",text:"A join on all columns"}],
    correct_option_id:"a" },
  { id:"q_join_m2", topic:"joins", difficulty:"medium",
    prompt:"What is a CROSS JOIN?",
    options:[{id:"a",text:"A join filtering cross-referenced tables"},{id:"b",text:"Every row in the first table combined with every row in the second"},{id:"c",text:"A join on foreign keys only"},{id:"d",text:"A join that removes duplicates"}],
    correct_option_id:"b" },
  { id:"q_join_h1", topic:"joins", difficulty:"hard",
    prompt:"What is a self-join used for?",
    options:[{id:"a",text:"Joining a table to itself to compare rows within the same table"},{id:"b",text:"Joining all tables in a schema"},{id:"c",text:"Joining a table to its backup"},{id:"d",text:"A join that only returns one row"}],
    correct_option_id:"a" },

  // ── normalization ─────────────────────────────────────────────────────────
  { id:"q_norm_e1", topic:"normalization", difficulty:"easy",
    prompt:"What is database normalization?",
    options:[{id:"a",text:"Encrypting a database"},{id:"b",text:"Organising a database to reduce redundancy and improve integrity"},{id:"c",text:"Backing up a database"},{id:"d",text:"Indexing all columns"}],
    correct_option_id:"b" },
  { id:"q_norm_e2", topic:"normalization", difficulty:"easy",
    prompt:"What problem does normalization primarily solve?",
    options:[{id:"a",text:"Slow queries"},{id:"b",text:"Data redundancy and update anomalies"},{id:"c",text:"Missing indexes"},{id:"d",text:"Lack of foreign keys"}],
    correct_option_id:"b" },
  { id:"q_norm_m1", topic:"normalization", difficulty:"medium",
    prompt:"What is 1NF (First Normal Form)?",
    options:[{id:"a",text:"All columns are indexed"},{id:"b",text:"Each column holds atomic (indivisible) values and each row is unique"},{id:"c",text:"No foreign keys exist"},{id:"d",text:"All tables have a primary key"}],
    correct_option_id:"b" },
  { id:"q_norm_m2", topic:"normalization", difficulty:"medium",
    prompt:"What does 2NF require beyond 1NF?",
    options:[{id:"a",text:"No partial dependencies on a composite primary key"},{id:"b",text:"All columns are NOT NULL"},{id:"c",text:"No foreign keys"},{id:"d",text:"All values are unique"}],
    correct_option_id:"a" },
  { id:"q_norm_h1", topic:"normalization", difficulty:"hard",
    prompt:"What is denormalization and when is it used?",
    options:[{id:"a",text:"Removing all indexes for faster writes"},{id:"b",text:"Intentionally introducing redundancy to improve read performance"},{id:"c",text:"Converting a relational database to NoSQL"},{id:"d",text:"Merging two databases"}],
    correct_option_id:"b" },

  // ── transactions ──────────────────────────────────────────────────────────
  { id:"q_txn_e1", topic:"transactions", difficulty:"easy",
    prompt:"What is a database transaction?",
    options:[{id:"a",text:"A financial payment in a database"},{id:"b",text:"A unit of work that is executed as a whole"},{id:"c",text:"A stored procedure"},{id:"d",text:"A type of index"}],
    correct_option_id:"b" },
  { id:"q_txn_e2", topic:"transactions", difficulty:"easy",
    prompt:"What does COMMIT do in SQL?",
    options:[{id:"a",text:"Undoes all changes since the last commit"},{id:"b",text:"Permanently saves all changes made during the transaction"},{id:"c",text:"Locks the table"},{id:"d",text:"Starts a new transaction"}],
    correct_option_id:"b" },
  { id:"q_txn_m1", topic:"transactions", difficulty:"medium",
    prompt:"What does ROLLBACK do?",
    options:[{id:"a",text:"Saves changes permanently"},{id:"b",text:"Undoes all changes since the last COMMIT or SAVEPOINT"},{id:"c",text:"Drops the table"},{id:"d",text:"Creates a backup"}],
    correct_option_id:"b" },
  { id:"q_txn_m2", topic:"transactions", difficulty:"medium",
    prompt:"What is isolation in the context of ACID?",
    options:[{id:"a",text:"Transactions are stored separately on disk"},{id:"b",text:"Concurrent transactions do not interfere with each other"},{id:"c",text:"Each transaction has its own database copy"},{id:"d",text:"Transactions are encrypted"}],
    correct_option_id:"b" },
  { id:"q_txn_h1", topic:"transactions", difficulty:"hard",
    prompt:"What is a dirty read?",
    options:[{id:"a",text:"Reading corrupted data from disk"},{id:"b",text:"Reading uncommitted data from another transaction"},{id:"c",text:"Reading deleted rows"},{id:"d",text:"Reading encrypted data"}],
    correct_option_id:"b" },


  // ══════════════════════════════════════════════════════════════════════════
  // PATH 4: DATA STRUCTURES AND ALGORITHMS
  // ══════════════════════════════════════════════════════════════════════════

  // ── time_space_complexity ─────────────────────────────────────────────────
  { id:"q_cplx_e1", topic:"time_space_complexity", difficulty:"easy",
    prompt:"What does O(1) time complexity mean?",
    options:[{id:"a",text:"The algorithm runs in one second"},{id:"b",text:"The running time is constant regardless of input size"},{id:"c",text:"The algorithm uses one unit of memory"},{id:"d",text:"The loop runs once"}],
    correct_option_id:"b" },
  { id:"q_cplx_e2", topic:"time_space_complexity", difficulty:"easy",
    prompt:"What does Big-O notation describe?",
    options:[{id:"a",text:"The exact running time of an algorithm"},{id:"b",text:"An upper bound on the growth rate of an algorithm's resource usage"},{id:"c",text:"The best-case performance"},{id:"d",text:"The memory usage only"}],
    correct_option_id:"b" },
  { id:"q_cplx_m1", topic:"time_space_complexity", difficulty:"medium",
    prompt:"What is the time complexity of binary search?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(n²)"},{id:"d",text:"O(1)"}],
    correct_option_id:"b" },
  { id:"q_cplx_m2", topic:"time_space_complexity", difficulty:"medium",
    prompt:"What is space complexity?",
    options:[{id:"a",text:"The time an algorithm takes to run"},{id:"b",text:"The amount of memory an algorithm uses relative to input size"},{id:"c",text:"The number of lines of code"},{id:"d",text:"The disk space a program occupies"}],
    correct_option_id:"b" },
  { id:"q_cplx_h1", topic:"time_space_complexity", difficulty:"hard",
    prompt:"What is the time complexity of merge sort?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(n log n)"},{id:"c",text:"O(n²)"},{id:"d",text:"O(log n)"}],
    correct_option_id:"b" },

  // ── arrays (dsa) ──────────────────────────────────────────────────────────
  { id:"q_dsa_arr_e1", topic:"dsa_arrays", difficulty:"easy",
    prompt:"What is the time complexity of accessing an element by index in an array?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(1)"},{id:"d",text:"O(n²)"}],
    correct_option_id:"c" },
  { id:"q_dsa_arr_e2", topic:"dsa_arrays", difficulty:"easy",
    prompt:"What is an array?",
    options:[{id:"a",text:"A collection of elements at contiguous memory locations"},{id:"b",text:"A function that loops through numbers"},{id:"c",text:"A type of conditional"},{id:"d",text:"A single variable"}],
    correct_option_id:"a" },
  { id:"q_dsa_arr_m1", topic:"dsa_arrays", difficulty:"medium",
    prompt:"What is the time complexity of linear search in an unsorted array?",
    options:[{id:"a",text:"O(1)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(n)"},{id:"d",text:"O(n log n)"}],
    correct_option_id:"c" },
  { id:"q_dsa_arr_m2", topic:"dsa_arrays", difficulty:"medium",
    prompt:"What is a two-pointer technique used for in arrays?",
    options:[{id:"a",text:"Accessing two arrays simultaneously"},{id:"b",text:"Efficiently solving problems by maintaining two indices that move toward each other"},{id:"c",text:"Sorting with two comparators"},{id:"d",text:"Copying an array"}],
    correct_option_id:"b" },
  { id:"q_dsa_arr_h1", topic:"dsa_arrays", difficulty:"hard",
    prompt:"What is the sliding window technique?",
    options:[{id:"a",text:"A GUI concept for arrays"},{id:"b",text:"Maintaining a window of elements that slides through an array to solve subarray problems efficiently"},{id:"c",text:"A sorting algorithm"},{id:"d",text:"A memory management technique"}],
    correct_option_id:"b" },

  // ── linked_lists ──────────────────────────────────────────────────────────
  { id:"q_ll_e1", topic:"linked_lists", difficulty:"easy",
    prompt:"What is a linked list?",
    options:[{id:"a",text:"A list that links to an external file"},{id:"b",text:"A data structure where each element (node) contains data and a reference to the next node"},{id:"c",text:"A sorted array"},{id:"d",text:"A type of hash table"}],
    correct_option_id:"b" },
  { id:"q_ll_e2", topic:"linked_lists", difficulty:"easy",
    prompt:"What is the last node's next pointer in a singly linked list?",
    options:[{id:"a",text:"Points to the first node"},{id:"b",text:"Points to itself"},{id:"c",text:"Is null/None"},{id:"d",text:"Points to the middle node"}],
    correct_option_id:"c" },
  { id:"q_ll_m1", topic:"linked_lists", difficulty:"medium",
    prompt:"What is the time complexity of inserting at the head of a singly linked list?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(1)"},{id:"d",text:"O(n²)"}],
    correct_option_id:"c" },
  { id:"q_ll_m2", topic:"linked_lists", difficulty:"medium",
    prompt:"What is a doubly linked list?",
    options:[{id:"a",text:"Two separate linked lists"},{id:"b",text:"A linked list where each node has pointers to both next and previous nodes"},{id:"c",text:"A linked list with two head nodes"},{id:"d",text:"A circular linked list"}],
    correct_option_id:"b" },
  { id:"q_ll_h1", topic:"linked_lists", difficulty:"hard",
    prompt:"How do you detect a cycle in a linked list efficiently?",
    options:[{id:"a",text:"Store all nodes in a set and check for duplicates"},{id:"b",text:"Use Floyd's cycle detection algorithm with a slow and fast pointer"},{id:"c",text:"Reverse the list and compare"},{id:"d",text:"Sort the list and check adjacent nodes"}],
    correct_option_id:"b" },

  // ── stacks_queues ─────────────────────────────────────────────────────────
  { id:"q_sq_e1", topic:"stacks_queues", difficulty:"easy",
    prompt:"In a stack, which element is removed first?",
    options:[{id:"a",text:"The first element added"},{id:"b",text:"A random element"},{id:"c",text:"The last element added"},{id:"d",text:"The smallest element"}],
    correct_option_id:"c" },
  { id:"q_sq_e2", topic:"stacks_queues", difficulty:"easy",
    prompt:"In a queue, which element is removed first?",
    options:[{id:"a",text:"The last element added"},{id:"b",text:"The first element added"},{id:"c",text:"The largest element"},{id:"d",text:"A random element"}],
    correct_option_id:"b" },
  { id:"q_sq_m1", topic:"stacks_queues", difficulty:"medium",
    prompt:"Which data structure is best for implementing undo functionality?",
    options:[{id:"a",text:"Queue"},{id:"b",text:"Stack"},{id:"c",text:"Heap"},{id:"d",text:"Linked list"}],
    correct_option_id:"b" },
  { id:"q_sq_m2", topic:"stacks_queues", difficulty:"medium",
    prompt:"Which data structure is best for implementing BFS?",
    options:[{id:"a",text:"Stack"},{id:"b",text:"Queue"},{id:"c",text:"Heap"},{id:"d",text:"Array"}],
    correct_option_id:"b" },
  { id:"q_sq_h1", topic:"stacks_queues", difficulty:"hard",
    prompt:"How can you implement a queue using two stacks?",
    options:[{id:"a",text:"Push to stack1; to dequeue, move all to stack2 and pop"},{id:"b",text:"Use both stacks for pushing only"},{id:"c",text:"Use one stack for each direction"},{id:"d",text:"It is not possible"}],
    correct_option_id:"a" },

  // ── hashing ───────────────────────────────────────────────────────────────
  { id:"q_hash_e1", topic:"hashing", difficulty:"easy",
    prompt:"What is a hash function?",
    options:[{id:"a",text:"A function that encrypts data"},{id:"b",text:"A function that maps data of arbitrary size to fixed-size values"},{id:"c",text:"A function that sorts data"},{id:"d",text:"A function that compresses data"}],
    correct_option_id:"b" },
  { id:"q_hash_e2", topic:"hashing", difficulty:"easy",
    prompt:"What is the average time complexity of a lookup in a hash table?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(1)"},{id:"d",text:"O(n²)"}],
    correct_option_id:"c" },
  { id:"q_hash_m1", topic:"hashing", difficulty:"medium",
    prompt:"What is a hash collision?",
    options:[{id:"a",text:"When a hash function produces the same hash for two different inputs"},{id:"b",text:"When a hash table is full"},{id:"c",text:"When a hash function crashes"},{id:"d",text:"When two hash tables are merged"}],
    correct_option_id:"a" },
  { id:"q_hash_m2", topic:"hashing", difficulty:"medium",
    prompt:"What is chaining in hash table collision resolution?",
    options:[{id:"a",text:"Probing the next empty slot"},{id:"b",text:"Storing colliding elements in a linked list at each bucket"},{id:"c",text:"Doubling the table size"},{id:"d",text:"Using a second hash function"}],
    correct_option_id:"b" },
  { id:"q_hash_h1", topic:"hashing", difficulty:"hard",
    prompt:"What is the load factor of a hash table?",
    options:[{id:"a",text:"The number of hash collisions"},{id:"b",text:"The ratio of stored elements to total buckets"},{id:"c",text:"The time to insert an element"},{id:"d",text:"The size of each bucket"}],
    correct_option_id:"b" },

  // ── searching_sorting ─────────────────────────────────────────────────────
  { id:"q_srch_e1", topic:"searching_sorting", difficulty:"easy",
    prompt:"What is the prerequisite for binary search?",
    options:[{id:"a",text:"The array must be unsorted"},{id:"b",text:"The array must be sorted"},{id:"c",text:"The array must have unique values"},{id:"d",text:"The array must be of even length"}],
    correct_option_id:"b" },
  { id:"q_srch_e2", topic:"searching_sorting", difficulty:"easy",
    prompt:"What is the worst-case time complexity of bubble sort?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(n log n)"},{id:"c",text:"O(n²)"},{id:"d",text:"O(log n)"}],
    correct_option_id:"c" },
  { id:"q_srch_m1", topic:"searching_sorting", difficulty:"medium",
    prompt:"Which sorting algorithm is generally the fastest in practice?",
    options:[{id:"a",text:"Bubble sort"},{id:"b",text:"Insertion sort"},{id:"c",text:"Quick sort"},{id:"d",text:"Selection sort"}],
    correct_option_id:"c" },
  { id:"q_srch_m2", topic:"searching_sorting", difficulty:"medium",
    prompt:"What is a stable sorting algorithm?",
    options:[{id:"a",text:"An algorithm that never crashes"},{id:"b",text:"An algorithm that preserves the relative order of equal elements"},{id:"c",text:"An algorithm with O(n log n) complexity"},{id:"d",text:"An algorithm that uses extra memory"}],
    correct_option_id:"b" },
  { id:"q_srch_h1", topic:"searching_sorting", difficulty:"hard",
    prompt:"What is the best-case time complexity of quicksort?",
    options:[{id:"a",text:"O(n²)"},{id:"b",text:"O(n)"},{id:"c",text:"O(n log n)"},{id:"d",text:"O(log n)"}],
    correct_option_id:"c" },

  // ── trees_bst ─────────────────────────────────────────────────────────────
  { id:"q_tree_e1", topic:"trees_bst", difficulty:"easy",
    prompt:"What is a binary tree?",
    options:[{id:"a",text:"A tree where each node has at most two children"},{id:"b",text:"A tree with exactly two nodes"},{id:"c",text:"A sorted array"},{id:"d",text:"A tree with two roots"}],
    correct_option_id:"a" },
  { id:"q_tree_e2", topic:"trees_bst", difficulty:"easy",
    prompt:"In a BST, where are smaller values stored relative to the root?",
    options:[{id:"a",text:"Right subtree"},{id:"b",text:"Left subtree"},{id:"c",text:"At the root"},{id:"d",text:"Position is random"}],
    correct_option_id:"b" },
  { id:"q_tree_m1", topic:"trees_bst", difficulty:"medium",
    prompt:"What is the time complexity of search in a balanced BST?",
    options:[{id:"a",text:"O(n)"},{id:"b",text:"O(log n)"},{id:"c",text:"O(1)"},{id:"d",text:"O(n²)"}],
    correct_option_id:"b" },
  { id:"q_tree_m2", topic:"trees_bst", difficulty:"medium",
    prompt:"What is an inorder traversal of a BST?",
    options:[{id:"a",text:"Root, left, right"},{id:"b",text:"Left, right, root"},{id:"c",text:"Left, root, right — produces sorted output"},{id:"d",text:"Right, root, left"}],
    correct_option_id:"c" },
  { id:"q_tree_h1", topic:"trees_bst", difficulty:"hard",
    prompt:"What is an AVL tree?",
    options:[{id:"a",text:"A tree that automatically sorts its nodes"},{id:"b",text:"A self-balancing BST where heights of left and right subtrees differ by at most 1"},{id:"c",text:"A tree with at most 3 children per node"},{id:"d",text:"A tree that stores keys in arrays"}],
    correct_option_id:"b" },

  // ── graphs ────────────────────────────────────────────────────────────────
  { id:"q_grph_e1", topic:"graphs", difficulty:"easy",
    prompt:"What is a graph?",
    options:[{id:"a",text:"A chart for visualising data"},{id:"b",text:"A data structure of vertices (nodes) connected by edges"},{id:"c",text:"A type of sorted tree"},{id:"d",text:"A matrix of numbers"}],
    correct_option_id:"b" },
  { id:"q_grph_e2", topic:"graphs", difficulty:"easy",
    prompt:"What is the difference between a directed and undirected graph?",
    options:[{id:"a",text:"Directed edges have a direction; undirected edges do not"},{id:"b",text:"Undirected graphs are always cyclic"},{id:"c",text:"Directed graphs cannot have cycles"},{id:"d",text:"They are identical"}],
    correct_option_id:"a" },
  { id:"q_grph_m1", topic:"graphs", difficulty:"medium",
    prompt:"What algorithm finds the shortest path in an unweighted graph?",
    options:[{id:"a",text:"DFS"},{id:"b",text:"BFS"},{id:"c",text:"Dijkstra"},{id:"d",text:"Prim's"}],
    correct_option_id:"b" },
  { id:"q_grph_m2", topic:"graphs", difficulty:"medium",
    prompt:"What is a DAG?",
    options:[{id:"a",text:"A directed acyclic graph — a directed graph with no cycles"},{id:"b",text:"A double adjacency graph"},{id:"c",text:"A disconnected acyclic graph"},{id:"d",text:"A dynamic algorithm graph"}],
    correct_option_id:"a" },
  { id:"q_grph_h1", topic:"graphs", difficulty:"hard",
    prompt:"What is topological sorting used for?",
    options:[{id:"a",text:"Sorting vertices alphabetically"},{id:"b",text:"Ordering vertices of a DAG such that every edge goes from earlier to later in the order"},{id:"c",text:"Finding cycles in a graph"},{id:"d",text:"Shortest path in weighted graphs"}],
    correct_option_id:"b" },

  // ── problem_solving_patterns ──────────────────────────────────────────────
  { id:"q_psp_e1", topic:"problem_solving_patterns", difficulty:"easy",
    prompt:"What is the divide and conquer strategy?",
    options:[{id:"a",text:"Splitting a problem into subproblems, solving each, and combining results"},{id:"b",text:"Solving a problem using brute force"},{id:"c",text:"A sorting algorithm"},{id:"d",text:"A graph traversal technique"}],
    correct_option_id:"a" },
  { id:"q_psp_e2", topic:"problem_solving_patterns", difficulty:"easy",
    prompt:"What is dynamic programming?",
    options:[{id:"a",text:"Programming that runs dynamically at runtime"},{id:"b",text:"Solving problems by storing results of subproblems to avoid recomputation"},{id:"c",text:"A type of loop"},{id:"d",text:"Object-oriented programming"}],
    correct_option_id:"b" },
  { id:"q_psp_m1", topic:"problem_solving_patterns", difficulty:"medium",
    prompt:"What is memoization?",
    options:[{id:"a",text:"Writing code comments"},{id:"b",text:"Caching the results of expensive function calls and returning the cached result for the same inputs"},{id:"c",text:"A type of recursion"},{id:"d",text:"Optimising memory layout"}],
    correct_option_id:"b" },
  { id:"q_psp_m2", topic:"problem_solving_patterns", difficulty:"medium",
    prompt:"What is a greedy algorithm?",
    options:[{id:"a",text:"An algorithm that uses more memory than needed"},{id:"b",text:"An algorithm that makes the locally optimal choice at each step"},{id:"c",text:"An algorithm that tries all combinations"},{id:"d",text:"An algorithm that sorts first"}],
    correct_option_id:"b" },
  { id:"q_psp_h1", topic:"problem_solving_patterns", difficulty:"hard",
    prompt:"What is backtracking?",
    options:[{id:"a",text:"Undoing the last database transaction"},{id:"b",text:"Exploring candidates and abandoning those that cannot lead to a valid solution"},{id:"c",text:"Reversing a linked list"},{id:"d",text:"A sorting technique"}],
    correct_option_id:"b" },

];

// ── Import extra question types (predict_output, debugging, coding) ──────────
import { questionsExtra } from "./questionsExtra.js";

// Merge and normalise: every question gets a `type` (defaults to "mcq").
const ALL_QUESTIONS = [...mcqQuestions, ...questionsExtra].map((q) => ({
  type: "mcq", // default — overridden by questions that set their own type
  ...q,
}));

// Re-export so the rest of the codebase reads the merged, normalised bank.
export const questions = ALL_QUESTIONS;

// ── Question types ───────────────────────────────────────────────────────────
export const QUESTION_TYPES = ["mcq", "predict_output", "debugging", "coding"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Strip anything that would reveal the answer to the client.
// MCQ/predict/debug: drop correct_option_id, expected_output, explanation.
// Coding: drop hidden_test_cases and the answer/solution; KEEP sample_test_cases.
function stripAnswer(q) {
  const {
    correct_option_id,
    expected_output,
    explanation,
    hidden_test_cases,
    solution,
    ...safe
  } = q;
  return safe;
}

function withoutAnswers(pool) {
  return pool.map(stripAnswer);
}

// Difficulty mix per quiz: 2 easy + 2 medium + 1 hard (total 5)
const DIFFICULTY_MIX = { easy: 2, medium: 2, hard: 1 };
const QUIZ_SIZE = Object.values(DIFFICULTY_MIX).reduce((a, b) => a + b, 0); // 5

/**
 * Pick questions for a user.
 * @param topic      filter by topic (or null for adaptive weakest-topic pool)
 * @param mastery    user mastery array (for adaptive selection)
 * @param difficulty "easy"|"medium"|"hard" or null for mixed
 * @param type       "mcq"|"predict_output"|"debugging"|"coding" or null for any
 */
export function pickQuestionsForUser(topic, mastery, difficulty = null, type = null) {
  let base = topic ? questions.filter((q) => q.topic === topic) : getBestPool(mastery);

  // Filter by question type if requested
  if (type) base = base.filter((q) => q.type === type);

  // Specific difficulty: return up to QUIZ_SIZE of that difficulty
  if (difficulty) {
    const pool = base.filter((q) => q.difficulty === difficulty);
    return withoutAnswers(shuffle(pool).slice(0, QUIZ_SIZE));
  }

  // Mixed difficulty: balanced 2E/2M/1H
  const byDiff = {
    easy:   shuffle(base.filter((q) => q.difficulty === "easy")),
    medium: shuffle(base.filter((q) => q.difficulty === "medium")),
    hard:   shuffle(base.filter((q) => q.difficulty === "hard")),
  };
  const picked = [];
  for (const [diff, count] of Object.entries(DIFFICULTY_MIX)) {
    picked.push(...byDiff[diff].slice(0, count));
  }
  // Top up if a small bank is short
  if (picked.length < QUIZ_SIZE) {
    const usedIds = new Set(picked.map((q) => q.id));
    const extras = shuffle(base.filter((q) => !usedIds.has(q.id)));
    picked.push(...extras.slice(0, QUIZ_SIZE - picked.length));
  }
  return withoutAnswers(shuffle(picked));
}

// Choose pool based on weakest mastery topics (adaptive)
function getBestPool(mastery) {
  const ranked = [...(mastery || [])].sort((a, b) => a.mastery_score - b.mastery_score);
  const weakTopics = ranked.filter((m) => m.mastery_score < 60).map((m) => m.topic);
  const focusTopics = weakTopics.length
    ? weakTopics
    : ranked.length
    ? [ranked[0].topic]
    : [];

  if (focusTopics.length === 0) return questions;

  const pool = questions.filter((q) => focusTopics.includes(q.topic));
  if (pool.length < 3) {
    const extra = questions.filter((q) => !focusTopics.includes(q.topic));
    return [...pool, ...extra];
  }
  return pool;
}

/**
 * Available question types + counts for a topic.
 * Returns [{ type, easy, medium, hard, total }]
 */
export function questionTypesForTopic(topicId) {
  const pool = questions.filter((q) => q.topic === topicId);
  return QUESTION_TYPES.map((t) => {
    const tp = pool.filter((q) => q.type === t);
    return {
      type:  t,
      easy:   tp.filter((q) => q.difficulty === "easy").length,
      medium: tp.filter((q) => q.difficulty === "medium").length,
      hard:   tp.filter((q) => q.difficulty === "hard").length,
      total:  tp.length,
    };
  }).filter((t) => t.total > 0);
}
