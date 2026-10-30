// ── Learning Path definitions ─────────────────────────────────────────────────
// Each path has an ordered list of topics. Each topic:
//   - id:            matches the question bank topic string exactly
//   - label:         display name
//   - description:   one-line summary
//   - prerequisites: topic ids that must be passed (best_score >= PASS_THRESHOLD)
//   - icon:          emoji
// Topics with no questions yet show an empty state in the UI (by design).

export const PASS_THRESHOLD = 70; // % — configurable in one place

export const LEARNING_PATHS = [
  // ── 1. Programming Fundamentals ──────────────────────────────────────────────
  {
    id:"prog_fundamentals", label:"Programming Fundamentals", icon:"💻",
    description:"Core programming concepts from variables through recursion.",
    topics:[
      mk("variables","Variables & Data Types","Named storage, types, scope, and immutability.","📦",[],1),
      mk("operators","Operators","Arithmetic, comparison, logical, and assignment operators.","➗",["variables"],2),
      mk("input_output","Input & Output","Reading user input and printing output.","⌨️",["variables"],3),
      mk("conditions","Conditional Statements","if, elif, else, and boolean logic.","🔀",["operators"],4),
      mk("for_loops","For Loops","Iterating a known number of times with for.","🔄",["conditions"],5),
      mk("while_loops","While Loops","Iterating until a condition becomes false.","🔁",["conditions"],6),
      mk("nested_loops","Nested Loops","Loops inside loops and their complexity.","🪆",["for_loops","while_loops"],7),
      mk("number_patterns","Number Patterns","Printing structured number sequences.","🔢",["nested_loops"],8),
      mk("star_patterns","Star Patterns","Printing geometric star patterns.","⭐",["nested_loops"],9),
      mk("functions","Functions","Defining, calling, return values, parameters.","⚙️",["conditions"],10),
      mk("arrays_lists","Arrays & Lists","Ordered, mutable collections and operations.","📋",["functions"],11),
      mk("strings","Strings","Immutable text, slicing, and formatting.","🧵",["arrays_lists"],12),
      mk("recursion","Recursion","Base cases, recursive calls, and complexity.","♻️",["functions"],13),
    ],
  },

  // ── 2. Web Development ──────────────────────────────────────────────────────
  {
    id:"web_development", label:"Web Development", icon:"🌐",
    description:"Build the web: HTML, CSS, responsive design, JavaScript, DOM, and REST.",
    topics:[
      mk("html_basics","HTML Basics","Structure and semantic tags of a web page.","📄",[],1),
      mk("css_basics","CSS Basics","Selectors, the box model, and styling.","🎨",["html_basics"],2),
      mk("responsive_design","Responsive Design","Media queries, flexbox, and grid.","📱",["css_basics"],3),
      mk("javascript_fundamentals","JavaScript Fundamentals","Variables, types, functions, and promises.","🟨",["css_basics"],4),
      mk("dom_manipulation","DOM Manipulation","Selecting, modifying, and listening to the DOM.","🌳",["javascript_fundamentals"],5),
      mk("rest_api_basics","REST API Basics","HTTP methods, status codes, and JSON.","🔌",["javascript_fundamentals"],6),
    ],
  },

  // ── 3. Database Management ───────────────────────────────────────────────────
  {
    id:"database_management", label:"Database Management", icon:"🗄️",
    description:"Relational databases, SQL queries, joins, normalization, and transactions.",
    topics:[
      mk("dbms_fundamentals","DBMS Fundamentals","What a DBMS is and data integrity.","🗃️",[],1),
      mk("tables_keys","Tables, Keys & Constraints","Primary keys, foreign keys, and constraints.","🔑",["dbms_fundamentals"],2),
      mk("sql_basics","SQL Basics","SELECT, INSERT, UPDATE, DELETE.","📜",["tables_keys"],3),
      mk("filtering_sorting","Filtering & Sorting","WHERE, ORDER BY, LIKE, BETWEEN.","🔍",["sql_basics"],4),
      mk("aggregate_functions","Aggregate Functions","COUNT, SUM, AVG, MAX, MIN, GROUP BY.","📊",["filtering_sorting"],5),
      mk("joins","Joins","INNER, LEFT, RIGHT, FULL, and CROSS joins.","🔗",["filtering_sorting"],6),
      mk("normalization","Normalization","1NF, 2NF, 3NF, and denormalization.","📐",["joins"],7),
      mk("transactions","Transactions","ACID, COMMIT, ROLLBACK, and isolation.","💼",["joins"],8),
    ],
  },

  // ── 4. Data Structures and Algorithms ───────────────────────────────────────
  {
    id:"dsa", label:"Data Structures & Algorithms", icon:"🧮",
    description:"Complexity, arrays, linked lists, stacks, hashing, sorting, trees, graphs.",
    topics:[
      mk("time_space_complexity","Time & Space Complexity","Big-O analysis of algorithms.","⏱️",[],1),
      mk("dsa_arrays","Arrays","Indexing, searching, two-pointer, and sliding window.","🔢",["time_space_complexity"],2),
      mk("linked_lists","Linked Lists","Singly, doubly, and cycle detection.","⛓️",["dsa_arrays"],3),
      mk("stacks_queues","Stacks & Queues","LIFO/FIFO structures and applications.","📚",["linked_lists"],4),
      mk("hashing","Hashing","Hash functions, tables, collisions, and load factor.","#️⃣",["dsa_arrays"],5),
      mk("searching_sorting","Searching & Sorting","Binary search, quicksort, and stability.","🔃",["dsa_arrays"],6),
      mk("trees_bst","Trees & BSTs","Binary trees, traversal, and self-balancing trees.","🌳",["searching_sorting"],7),
      mk("graphs","Graphs","BFS, DFS, DAGs, and topological sort.","🕸️",["trees_bst"],8),
      mk("problem_solving_patterns","Problem-Solving Patterns","Divide & conquer, DP, greedy, and backtracking.","🧩",["graphs"],9),
    ],
  },

  // ── 5. Operating Systems ────────────────────────────────────────────────────
  {
    id:"operating_systems", label:"Operating Systems", icon:"🖥️",
    description:"Processes, scheduling, synchronization, deadlocks, and memory.",
    topics:[
      mk("os_fundamentals","OS Fundamentals","What an OS does and its services.","🖥️",[],1),
      mk("processes_threads","Processes & Threads","Concurrency and program execution.","🧵",["os_fundamentals"],2),
      mk("cpu_scheduling","CPU Scheduling","FCFS, SJF, round robin, and priorities.","⏳",["processes_threads"],3),
      mk("synchronization","Synchronization","Mutexes, semaphores, and critical sections.","🔒",["processes_threads"],4),
      mk("deadlocks","Deadlocks","Conditions, prevention, and avoidance.","💀",["synchronization"],5),
      mk("memory_management","Memory Management","Allocation, paging, and segmentation.","💾",["os_fundamentals"],6),
      mk("virtual_memory","Virtual Memory","Paging, page faults, and TLBs.","💿",["memory_management"],7),
    ],
  },

  // ── 6. Computer Networks ─────────────────────────────────────────────────────
  {
    id:"computer_networks", label:"Computer Networks", icon:"📡",
    description:"OSI/TCP-IP, addressing, TCP/UDP, DNS/DHCP, HTTP/HTTPS, and routing.",
    topics:[
      mk("networking_fundamentals","Networking Fundamentals","Basic concepts, LANs, and protocols.","🌐",[],1),
      mk("osi_tcp","OSI & TCP/IP Models","The seven layers and the four-layer model.","🗂️",["networking_fundamentals"],2),
      mk("ip_addressing","IP Addressing & Subnetting","IPv4, subnets, and CIDR.","🔢",["osi_tcp"],3),
      mk("tcp_udp","TCP & UDP","Reliable vs. connectionless transport.","🚚",["osi_tcp"],4),
      mk("dns_dhcp","DNS & DHCP","Name resolution and dynamic IP assignment.","🧭",["tcp_udp"],5),
      mk("http_https","HTTP & HTTPS","Request/response and secure transport.","🔒",["tcp_udp"],6),
      mk("routing_devices","Routing & Network Devices","Routers, switches, and forwarding.","🔀",["ip_addressing"],7),
    ],
  },

  // ── 7. Linux ────────────────────────────────────────────────────────────────
  {
    id:"linux", label:"Linux", icon:"🐧",
    description:"Command line, files, permissions, processes, pipes, and scripting.",
    topics:[
      mk("linux","Linux Fundamentals","Navigation, listing, and basic commands.","🐧",[],1),
      mk("files_directories","Files & Directories","Creating, moving, and removing files and dirs.","📁",["linux"],2),
      mk("file_operations","File Operations","Reading, editing, copying, and searching.","📝",["files_directories"],3),
      mk("permissions","Permissions","chmod, chown, and ownership.","🔐",["file_operations"],4),
      mk("linux_processes","Processes","ps, top, kill, and background jobs.","⚙️",["linux"],5),
      mk("pipes_redirection","Pipes & Redirection","|, >, >>, and command chaining.","➡️",["file_operations"],6),
      mk("shell_scripting","Shell Scripting Basics","Variables, loops, and simple scripts.","📜",["pipes_redirection"],7),
    ],
  },
];

// ── Helper to keep topic definitions compact ─────────────────────────────────
function mk(id,label,description,icon,prerequisites,order){
  return { id, label, description, icon, prerequisites, order };
}

// ── Flat lookup helpers ───────────────────────────────────────────────────────
export const TOPIC_MAP = Object.fromEntries(
  LEARNING_PATHS.flatMap((p) =>
    p.topics.map((t) => [t.id, { ...t, pathId: p.id, pathLabel: p.label }])
  )
);
export const ALL_TOPIC_IDS = Object.keys(TOPIC_MAP);
export function getPathForTopic(topicId){
  return LEARNING_PATHS.find((p) => p.topics.some((t) => t.id === topicId)) || null;
}
