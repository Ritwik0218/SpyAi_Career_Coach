export const neetcode150 = [
  {
    id: "two-sum",
    title: "Two Sum",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/two-sum/",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`
    },
    solutionCode: {
      javascript: `var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        prevMap = {} # val : index
        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
        return []`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for(int i = 0; i < nums.size(); i++){
            if(mp.find(target - nums[i]) != mp.end()){
                return {mp[target - nums[i]], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> prevMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            int diff = target - num;
            if (prevMap.containsKey(diff)) {
                return new int[] { prevMap.get(diff), i };
            }
            prevMap.put(num, i);
        }
        return new int[] {};
    }
}`
    },
    testExecutionCode: {
      javascript: `console.log("=== Running Test Cases ===");
console.log("Test Case 1: nums=[2,7,11,15], target=9");
console.log("Output:", JSON.stringify(twoSum([2,7,11,15], 9)));`,
      python: `print("=== Running Test Cases ===")
print("Test Case 1: nums=[2,7,11,15], target=9")
sol = Solution()
print("Output:", sol.twoSum([2,7,11,15], 9))`,
      cpp: `int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = sol.twoSum(nums, 9);
    cout << "=== Running Test Cases ===" << endl;
    cout << "Test Case 1: nums=[2,7,11,15], target=9" << endl;
    cout << "Output: [";
    for(size_t i=0; i<res.size(); i++) {
        cout << res[i] << (i == res.size()-1 ? "" : ",");
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] res = sol.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("=== Running Test Cases ===");
        System.out.println("Test Case 1: nums=[2,7,11,15], target=9");
        if(res.length == 2) {
            System.out.println("Output: [" + res[0] + "," + res[1] + "]");
        } else {
            System.out.println("Output: []");
        }
    }
}`
    }
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-anagram/",
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    
};`,
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        `,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        
    }
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        
    }
}`
    },
    solutionCode: {
      javascript: `var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;
    const count = {};
    for (let char of s) {
        count[char] = (count[char] || 0) + 1;
    }
    for (let char of t) {
        if (!count[char]) return false;
        count[char]--;
    }
    return true;
};`,
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        countS, countT = {}, {}
        for i in range(len(s)):
            countS[s[i]] = 1 + countS.get(s[i], 0)
            countT[t[i]] = 1 + countT.get(t[i], 0)
        return countS == countT`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if(s.size() != t.size()) return false;
        unordered_map<char,int> smap;
        unordered_map<char,int> tmap;
        for(int i = 0; i < s.size(); i++){
            smap[s[i]]++;
            tmap[t[i]]++;
        }
        return smap == tmap;
    }
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] store = new int[26];
        for (int i = 0; i < s.length(); i++) {
            store[s.charAt(i) - 'a']++;
            store[t.charAt(i) - 'a']--;
        }
        for (int n : store) if (n != 0) return false;
        return true;
    }
}`
    },
    testExecutionCode: {
      javascript: `console.log("=== Running Test Cases ===");
console.log("Test Case 1: s='anagram', t='nagaram'");
console.log("Output:", isAnagram("anagram", "nagaram"));`,
      python: `print("=== Running Test Cases ===")
print("Test Case 1: s='anagram', t='nagaram'")
sol = Solution()
print("Output:", sol.isAnagram("anagram", "nagaram"))`,
      cpp: `int main() {
    Solution sol;
    cout << "=== Running Test Cases ===" << endl;
    cout << "Test Case 1: s='anagram', t='nagaram'" << endl;
    cout << "Output: " << (sol.isAnagram("anagram", "nagaram") ? "true" : "false") << endl;
    return 0;
}`,
      java: `class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println("=== Running Test Cases ===");
        System.out.println("Test Case 1: s='anagram', t='nagaram'");
        System.out.println("Output: " + sol.isAnagram("anagram", "nagaram"));
    }
}`
    }
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/contains-duplicate/",
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    
};`,
      python: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        `,
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        
    }
};`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        
    }
}`
    },
    solutionCode: {
      javascript: `var containsDuplicate = function(nums) {
    const s = new Set(nums);
    return s.size !== nums.length;
};`,
      python: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        hashset = set()
        for n in nums:
            if n in hashset:
                return True
            hashset.add(n)
        return False`,
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> s;
        for (int i = 0; i < nums.size(); i++) {
            if (s.find(nums[i]) != s.end()) {
                return true;
            }
            s.insert(nums[i]);
        }
        return false;
    }
};`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        HashSet<Integer> set = new HashSet<>();
        for (int num : nums) {
            if (set.contains(num)) {
                return true;
            }
            set.add(num);
        }
        return false;
    }
}`
    }
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    category: "Two Pointers",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-palindrome/",
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a **palindrome**, or \`false\` otherwise.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false" }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    
};`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        `,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        
    }
}`
    },
    solutionCode: {
      javascript: `var isPalindrome = function(s) {
    let l = 0, r = s.length - 1;
    while (l < r) {
        while (l < r && !isAlphaNum(s[l])) l++;
        while (l < r && !isAlphaNum(s[r])) r--;
        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
        l++; r--;
    }
    return true;
};
function isAlphaNum(c) {
    return /^[a-zA-Z0-9]$/.test(c);
}`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        while l < r:
            while l < r and not self.alphaNum(s[l]):
                l += 1
            while r > l and not self.alphaNum(s[r]):
                r -= 1
            if s[l].lower() != s[r].lower():
                return False
            l, r = l + 1, r - 1
        return True
    
    def alphaNum(self, c):
        return (ord('A') <= ord(c) <= ord('Z') or 
                ord('a') <= ord(c) <= ord('z') or 
                ord('0') <= ord(c) <= ord('9'))`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`
    }
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    category: "Sliding Window",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
      { input: "prices = [7,6,4,3,1]", output: "0" }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    
};`,
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        `,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        
    }
}`
    },
    solutionCode: {
      javascript: `var maxProfit = function(prices) {
    let l = 0, r = 1;
    let maxP = 0;
    while (r < prices.length) {
        if (prices[l] < prices[r]) {
            let profit = prices[r] - prices[l];
            maxP = Math.max(maxP, profit);
        } else {
            l = r;
        }
        r++;
    }
    return maxP;
};`,
      python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        l, r = 0, 1
        maxP = 0
        while r < len(prices):
            if prices[l] < prices[r]:
                profit = prices[r] - prices[l]
                maxP = max(maxP, profit)
            else:
                l = r
            r += 1
        return maxP`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int l = 0, r = 1, maxP = 0;
        while (r < prices.size()) {
            if (prices[l] < prices[r]) {
                int profit = prices[r] - prices[l];
                maxP = max(maxP, profit);
            } else {
                l = r;
            }
            r++;
        }
        return maxP;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int l = 0, r = 1;
        int maxP = 0;
        while (r < prices.length) {
            if (prices[l] < prices[r]) {
                int profit = prices[r] - prices[l];
                maxP = Math.max(maxP, profit);
            } else {
                l = r;
            }
            r++;
        }
        return maxP;
    }
}`
    }
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    category: "Stack",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-parentheses/",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`
    },
    solutionCode: {
      javascript: `var isValid = function(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let char of s) {
        if (map[char]) {
            if (stack.length && stack[stack.length - 1] === map[char]) {
                stack.pop();
            } else {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        Map = {")": "(", "]": "[", "}": "{"}
        stack = []
        for c in s:
            if c not in Map:
                stack.append(c)
                continue
            if not stack or stack[-1] != Map[c]:
                return False
            stack.pop()
        return not stack`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> closeToOpen = {
            {')', '('},
            {']', '['},
            {'}', '{'}
        };
        for (char c : s) {
            if (closeToOpen.count(c)) {
                if (!st.empty() && st.top() == closeToOpen[c]) {
                    st.pop();
                } else {
                    return false;
                }
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        HashMap<Character, Character> map = new HashMap<>();
        map.put(')', '(');
        map.put('}', '{');
        map.put(']', '[');
        for (char c : s.toCharArray()) {
            if (map.containsKey(c)) {
                if (!stack.isEmpty() && stack.peek() == map.get(c)) {
                    stack.pop();
                } else {
                    return false;
                }
            } else {
                stack.push(c);
            }
        }
        return stack.isEmpty();
    }
}`
    }
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    category: "Trees",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/invert-binary-tree/",
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", output: "[2,3,1]" }
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        `,
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        
    }
};`,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        
    }
}`
    },
    solutionCode: {
      javascript: `var invertTree = function(root) {
    if (!root) return null;
    let temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
};`,
      python: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        temp = root.left
        root.left = self.invertTree(root.right)
        root.right = self.invertTree(temp)
        return root`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (root == nullptr) return nullptr;
        TreeNode* temp = root->left;
        root->left = invertTree(root->right);
        root->right = invertTree(temp);
        return root;
    }
};`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`
    }
  }
];

export const categories = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation"
];
