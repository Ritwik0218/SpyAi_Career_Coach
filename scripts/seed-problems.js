const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const problems = [
  // Arrays & Hashing
  { id: "contains-duplicate", title: "Contains Duplicate", category: "Arrays & Hashing", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/" },
  { id: "valid-anagram", title: "Valid Anagram", category: "Arrays & Hashing", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/" },
  { id: "two-sum", title: "Two Sum", category: "Arrays & Hashing", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
  { id: "group-anagrams", title: "Group Anagrams", category: "Arrays & Hashing", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/" },
  { id: "top-k-frequent-elements", title: "Top K Frequent Elements", category: "Arrays & Hashing", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: "product-of-array-except-self", title: "Product of Array Except Self", category: "Arrays & Hashing", difficulty: "Medium", link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: "valid-sudoku", title: "Valid Sudoku", category: "Arrays & Hashing", difficulty: "Medium", link: "https://leetcode.com/problems/valid-sudoku/" },
  { id: "encode-and-decode-strings", title: "Encode and Decode Strings", category: "Arrays & Hashing", difficulty: "Medium", link: "https://leetcode.com/problems/encode-and-decode-strings/" },
  { id: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", category: "Arrays & Hashing", difficulty: "Medium", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },

  // Two Pointers
  { id: "valid-palindrome", title: "Valid Palindrome", category: "Two Pointers", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
  { id: "two-sum-ii-input-array-is-sorted", title: "Two Sum II", category: "Two Pointers", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { id: "3sum", title: "3Sum", category: "Two Pointers", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
  { id: "container-with-most-water", title: "Container With Most Water", category: "Two Pointers", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
  { id: "trapping-rain-water", title: "Trapping Rain Water", category: "Two Pointers", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },

  // Sliding Window
  { id: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", category: "Sliding Window", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", category: "Sliding Window", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", category: "Sliding Window", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { id: "permutation-in-string", title: "Permutation In String", category: "Sliding Window", difficulty: "Medium", link: "https://leetcode.com/problems/permutation-in-string/" },
  { id: "minimum-window-substring", title: "Minimum Window Substring", category: "Sliding Window", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: "sliding-window-maximum", title: "Sliding Window Maximum", category: "Sliding Window", difficulty: "Hard", link: "https://leetcode.com/problems/sliding-window-maximum/" },

  // Stack
  { id: "valid-parentheses", title: "Valid Parentheses", category: "Stack", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/" },
  { id: "min-stack", title: "Min Stack", category: "Stack", difficulty: "Medium", link: "https://leetcode.com/problems/min-stack/" },
  { id: "evaluate-reverse-polish-notation", title: "Evaluate Reverse Polish Notation", category: "Stack", difficulty: "Medium", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id: "generate-parentheses", title: "Generate Parentheses", category: "Stack", difficulty: "Medium", link: "https://leetcode.com/problems/generate-parentheses/" },
  { id: "daily-temperatures", title: "Daily Temperatures", category: "Stack", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/" },
  { id: "car-fleet", title: "Car Fleet", category: "Stack", difficulty: "Medium", link: "https://leetcode.com/problems/car-fleet/" },
  { id: "largest-rectangle-in-histogram", title: "Largest Rectangle In Histogram", category: "Stack", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },

  // Binary Search
  { id: "binary-search", title: "Binary Search", category: "Binary Search", difficulty: "Easy", link: "https://leetcode.com/problems/binary-search/" },
  { id: "search-a-2d-matrix", title: "Search a 2D Matrix", category: "Binary Search", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: "koko-eating-bananas", title: "Koko Eating Bananas", category: "Binary Search", difficulty: "Medium", link: "https://leetcode.com/problems/koko-eating-bananas/" },
  { id: "find-minimum-in-rotated-sorted-array", title: "Find Minimum in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: "time-based-key-value-store", title: "Time Based Key-Value Store", category: "Binary Search", difficulty: "Medium", link: "https://leetcode.com/problems/time-based-key-value-store/" },
  { id: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", category: "Binary Search", difficulty: "Hard", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

  // Linked List
  { id: "reverse-linked-list", title: "Reverse Linked List", category: "Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", category: "Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: "reorder-list", title: "Reorder List", category: "Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/reorder-list/" },
  { id: "remove-nth-node-from-end-of-list", title: "Remove Nth Node From End of List", category: "Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: "copy-list-with-random-pointer", title: "Copy List with Random Pointer", category: "Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
  { id: "add-two-numbers", title: "Add Two Numbers", category: "Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/add-two-numbers/" },
  { id: "linked-list-cycle", title: "Linked List Cycle", category: "Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: "find-the-duplicate-number", title: "Find the Duplicate Number", category: "Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/find-the-duplicate-number/" },
  { id: "lru-cache", title: "LRU Cache", category: "Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/lru-cache/" },
  { id: "merge-k-sorted-lists", title: "Merge K Sorted Lists", category: "Linked List", difficulty: "Hard", link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  { id: "reverse-nodes-in-k-group", title: "Reverse Nodes in K-Group", category: "Linked List", difficulty: "Hard", link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },

  // Trees
  { id: "invert-binary-tree", title: "Invert Binary Tree", category: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", category: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: "diameter-of-binary-tree", title: "Diameter of Binary Tree", category: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/diameter-of-binary-tree/" },
  { id: "balanced-binary-tree", title: "Balanced Binary Tree", category: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/balanced-binary-tree/" },
  { id: "same-tree", title: "Same Tree", category: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/same-tree/" },
  { id: "subtree-of-another-tree", title: "Subtree of Another Tree", category: "Trees", difficulty: "Easy", link: "https://leetcode.com/problems/subtree-of-another-tree/" },
  { id: "lowest-common-ancestor-of-a-binary-search-tree", title: "Lowest Common Ancestor of a BST", category: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
  { id: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", category: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: "binary-tree-right-side-view", title: "Binary Tree Right Side View", category: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
  { id: "count-good-nodes-in-binary-tree", title: "Count Good Nodes in Binary Tree", category: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
  { id: "validate-binary-search-tree", title: "Validate Binary Search Tree", category: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: "kth-smallest-element-in-a-bst", title: "Kth Smallest Element in a BST", category: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: "construct-binary-tree-from-preorder-and-inorder-traversal", title: "Construct Binary Tree from Preorder and Inorder Traversal", category: "Trees", difficulty: "Medium", link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", category: "Trees", difficulty: "Hard", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id: "serialize-and-deserialize-binary-tree", title: "Serialize and Deserialize Binary Tree", category: "Trees", difficulty: "Hard", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

  // Tries
  { id: "implement-trie-prefix-tree", title: "Implement Trie (Prefix Tree)", category: "Tries", difficulty: "Medium", link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id: "design-add-and-search-words-data-structure", title: "Design Add and Search Words Data Structure", category: "Tries", difficulty: "Medium", link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
  { id: "word-search-ii", title: "Word Search II", category: "Tries", difficulty: "Hard", link: "https://leetcode.com/problems/word-search-ii/" },

  // Heap / Priority Queue
  { id: "kth-largest-element-in-a-stream", title: "Kth Largest Element in a Stream", category: "Heap / Priority Queue", difficulty: "Easy", link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { id: "last-stone-weight", title: "Last Stone Weight", category: "Heap / Priority Queue", difficulty: "Easy", link: "https://leetcode.com/problems/last-stone-weight/" },
  { id: "k-closest-points-to-origin", title: "K Closest Points to Origin", category: "Heap / Priority Queue", difficulty: "Medium", link: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  { id: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", category: "Heap / Priority Queue", difficulty: "Medium", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { id: "task-scheduler", title: "Task Scheduler", category: "Heap / Priority Queue", difficulty: "Medium", link: "https://leetcode.com/problems/task-scheduler/" },
  { id: "design-twitter", title: "Design Twitter", category: "Heap / Priority Queue", difficulty: "Medium", link: "https://leetcode.com/problems/design-twitter/" },
  { id: "find-median-from-data-stream", title: "Find Median from Data Stream", category: "Heap / Priority Queue", difficulty: "Hard", link: "https://leetcode.com/problems/find-median-from-data-stream/" },

  // Backtracking
  { id: "subsets", title: "Subsets", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
  { id: "combination-sum", title: "Combination Sum", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/" },
  { id: "permutations", title: "Permutations", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/permutations/" },
  { id: "subsets-ii", title: "Subsets II", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/subsets-ii/" },
  { id: "combination-sum-ii", title: "Combination Sum II", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-ii/" },
  { id: "word-search", title: "Word Search", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/word-search/" },
  { id: "palindrome-partitioning", title: "Palindrome Partitioning", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/palindrome-partitioning/" },
  { id: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", category: "Backtracking", difficulty: "Medium", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
  { id: "n-queens", title: "N-Queens", category: "Backtracking", difficulty: "Hard", link: "https://leetcode.com/problems/n-queens/" },

  // Graphs
  { id: "number-of-islands", title: "Number of Islands", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/" },
  { id: "clone-graph", title: "Clone Graph", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/" },
  { id: "max-area-of-island", title: "Max Area of Island", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/max-area-of-island/" },
  { id: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: "surrounded-regions", title: "Surrounded Regions", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/surrounded-regions/" },
  { id: "rotting-oranges", title: "Rotting Oranges", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/rotting-oranges/" },
  { id: "walls-and-gates", title: "Walls and Gates", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/walls-and-gates/" },
  { id: "course-schedule", title: "Course Schedule", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule/" },
  { id: "course-schedule-ii", title: "Course Schedule II", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule-ii/" },
  { id: "redundant-connection", title: "Redundant Connection", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/redundant-connection/" },
  { id: "word-ladder", title: "Word Ladder", category: "Graphs", difficulty: "Hard", link: "https://leetcode.com/problems/word-ladder/" },
  { id: "graph-valid-tree", title: "Graph Valid Tree", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: "number-of-connected-components-in-an-undirected-graph", title: "Number of Connected Components In An Undirected Graph", category: "Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },

  // Advanced Graphs
  { id: "reconstruct-itinerary", title: "Reconstruct Itinerary", category: "Advanced Graphs", difficulty: "Hard", link: "https://leetcode.com/problems/reconstruct-itinerary/" },
  { id: "min-cost-to-connect-all-points", title: "Min Cost to Connect All Points", category: "Advanced Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
  { id: "network-delay-time", title: "Network Delay Time", category: "Advanced Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/network-delay-time/" },
  { id: "swim-in-rising-water", title: "Swim in Rising Water", category: "Advanced Graphs", difficulty: "Hard", link: "https://leetcode.com/problems/swim-in-rising-water/" },
  { id: "alien-dictionary", title: "Alien Dictionary", category: "Advanced Graphs", difficulty: "Hard", link: "https://leetcode.com/problems/alien-dictionary/" },
  { id: "cheapest-flights-within-k-stops", title: "Cheapest Flights Within K Stops", category: "Advanced Graphs", difficulty: "Medium", link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },

  // 1-D Dynamic Programming
  { id: "climbing-stairs", title: "Climbing Stairs", category: "1-D Dynamic Programming", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", category: "1-D Dynamic Programming", difficulty: "Easy", link: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
  { id: "house-robber", title: "House Robber", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/" },
  { id: "house-robber-ii", title: "House Robber II", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber-ii/" },
  { id: "longest-palindromic-substring", title: "Longest Palindromic Substring", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: "palindromic-substrings", title: "Palindromic Substrings", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/palindromic-substrings/" },
  { id: "decode-ways", title: "Decode Ways", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/decode-ways/" },
  { id: "coin-change", title: "Coin Change", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/" },
  { id: "maximum-product-subarray", title: "Maximum Product Subarray", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-product-subarray/" },
  { id: "word-break", title: "Word Break", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/" },
  { id: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id: "partition-equal-subset-sum", title: "Partition Equal Subset Sum", category: "1-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/partition-equal-subset-sum/" },

  // 2-D Dynamic Programming
  { id: "unique-paths", title: "Unique Paths", category: "2-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths/" },
  { id: "longest-common-subsequence", title: "Longest Common Subsequence", category: "2-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: "best-time-to-buy-and-sell-stock-with-cooldown", title: "Best Time to Buy and Sell Stock with Cooldown", category: "2-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
  { id: "coin-change-ii", title: "Coin Change II", category: "2-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change-ii/" },
  { id: "target-sum", title: "Target Sum", category: "2-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/target-sum/" },
  { id: "interleaving-string", title: "Interleaving String", category: "2-D Dynamic Programming", difficulty: "Medium", link: "https://leetcode.com/problems/interleaving-string/" },
  { id: "longest-increasing-path-in-a-matrix", title: "Longest Increasing Path in a Matrix", category: "2-D Dynamic Programming", difficulty: "Hard", link: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/" },
  { id: "distinct-subsequences", title: "Distinct Subsequences", category: "2-D Dynamic Programming", difficulty: "Hard", link: "https://leetcode.com/problems/distinct-subsequences/" },
  { id: "edit-distance", title: "Edit Distance", category: "2-D Dynamic Programming", difficulty: "Hard", link: "https://leetcode.com/problems/edit-distance/" },
  { id: "burst-balloons", title: "Burst Balloons", category: "2-D Dynamic Programming", difficulty: "Hard", link: "https://leetcode.com/problems/burst-balloons/" },
  { id: "regular-expression-matching", title: "Regular Expression Matching", category: "2-D Dynamic Programming", difficulty: "Hard", link: "https://leetcode.com/problems/regular-expression-matching/" },

  // Greedy
  { id: "maximum-subarray", title: "Maximum Subarray", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/" },
  { id: "jump-game", title: "Jump Game", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game/" },
  { id: "jump-game-ii", title: "Jump Game II", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game-ii/" },
  { id: "gas-station", title: "Gas Station", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/gas-station/" },
  { id: "hand-of-straights", title: "Hand of Straights", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/hand-of-straights/" },
  { id: "merge-triplets-to-form-target-triplet", title: "Merge Triplets to Form Target Triplet", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
  { id: "partition-labels", title: "Partition Labels", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/partition-labels/" },
  { id: "valid-parenthesis-string", title: "Valid Parenthesis String", category: "Greedy", difficulty: "Medium", link: "https://leetcode.com/problems/valid-parenthesis-string/" },

  // Intervals
  { id: "insert-interval", title: "Insert Interval", category: "Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/insert-interval/" },
  { id: "merge-intervals", title: "Merge Intervals", category: "Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/merge-intervals/" },
  { id: "non-overlapping-intervals", title: "Non-overlapping Intervals", category: "Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/non-overlapping-intervals/" },
  { id: "meeting-rooms", title: "Meeting Rooms", category: "Intervals", difficulty: "Easy", link: "https://leetcode.com/problems/meeting-rooms/" },
  { id: "meeting-rooms-ii", title: "Meeting Rooms II", category: "Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/meeting-rooms-ii/" },
  { id: "minimum-interval-to-include-each-query", title: "Minimum Interval to Include Each Query", category: "Intervals", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },

  // Math & Geometry
  { id: "rotate-image", title: "Rotate Image", category: "Math & Geometry", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-image/" },
  { id: "spiral-matrix", title: "Spiral Matrix", category: "Math & Geometry", difficulty: "Medium", link: "https://leetcode.com/problems/spiral-matrix/" },
  { id: "set-matrix-zeroes", title: "Set Matrix Zeroes", category: "Math & Geometry", difficulty: "Medium", link: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { id: "happy-number", title: "Happy Number", category: "Math & Geometry", difficulty: "Easy", link: "https://leetcode.com/problems/happy-number/" },
  { id: "plus-one", title: "Plus One", category: "Math & Geometry", difficulty: "Easy", link: "https://leetcode.com/problems/plus-one/" },
  { id: "powx-n", title: "Pow(x, n)", category: "Math & Geometry", difficulty: "Medium", link: "https://leetcode.com/problems/powx-n/" },
  { id: "multiply-strings", title: "Multiply Strings", category: "Math & Geometry", difficulty: "Medium", link: "https://leetcode.com/problems/multiply-strings/" },
  { id: "detect-squares", title: "Detect Squares", category: "Math & Geometry", difficulty: "Medium", link: "https://leetcode.com/problems/detect-squares/" },

  // Bit Manipulation
  { id: "single-number", title: "Single Number", category: "Bit Manipulation", difficulty: "Easy", link: "https://leetcode.com/problems/single-number/" },
  { id: "number-of-1-bits", title: "Number of 1 Bits", category: "Bit Manipulation", difficulty: "Easy", link: "https://leetcode.com/problems/number-of-1-bits/" },
  { id: "counting-bits", title: "Counting Bits", category: "Bit Manipulation", difficulty: "Easy", link: "https://leetcode.com/problems/counting-bits/" },
  { id: "reverse-bits", title: "Reverse Bits", category: "Bit Manipulation", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-bits/" },
  { id: "missing-number", title: "Missing Number", category: "Bit Manipulation", difficulty: "Easy", link: "https://leetcode.com/problems/missing-number/" },
  { id: "sum-of-two-integers", title: "Sum of Two Integers", category: "Bit Manipulation", difficulty: "Medium", link: "https://leetcode.com/problems/sum-of-two-integers/" },
  { id: "reverse-integer", title: "Reverse Integer", category: "Bit Manipulation", difficulty: "Medium", link: "https://leetcode.com/problems/reverse-integer/" },
];

// Helper to pull over existing code from the hardcoded file for the 7 we already generated,
// so users don't lose the pre-generated content.
async function main() {
  console.log(`Starting to seed ${problems.length} problems into the database...`);
  
  // Try to load the existing problems from data/neetcode150.js if it still exists
  let preExisting = [];
  try {
    const data = require("../data/neetcode150.js");
    preExisting = data.neetcode150 || [];
  } catch(e) {
    console.log("Could not find data/neetcode150.js or could not load pre-existing problems.");
  }

  for (const problem of problems) {
    const existing = preExisting.find((p) => p.id === problem.id);
    
    // Merge existing data so we don't need to re-generate the first 7 via AI
    const data = {
      id: problem.id,
      title: problem.title,
      category: problem.category,
      difficulty: problem.difficulty,
      link: problem.link,
      description: existing ? existing.description : null,
      examples: existing ? existing.examples : null,
      starterCode: existing ? existing.starterCode : null,
      solutionCode: existing ? existing.solutionCode : null,
      testExecutionCode: existing ? existing.testExecutionCode : null,
    };

    // Upsert into DB
    await db.codingProblem.upsert({
      where: { id: problem.id },
      update: data,
      create: data,
    });
  }

  console.log("Successfully seeded 140+ problems!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
