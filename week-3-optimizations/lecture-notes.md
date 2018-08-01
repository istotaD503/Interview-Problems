# Optimizations

## Takeaway questions

- *Is there a better data structure for this job?*
- Could sorting help?
- Could "indexing" help?
- Could dynamic programming help?

## What is more optimal?

- Faster
- Takes less space
- At runtime
- Sometimes improving time / space complexity
- Sometimes about cutting corners ("reducing constants")

## Listen and ask

- *Don't* optimize unless your interviewer wants you to
- Every piece of information in an interview is usually important
- Anything special about the data?
- Repeated executions?

## Be a bored office clerk (whose job it is to enact the algorithm)

- Empathize with the machine
- Think about solving the problem manually
- How could "I" do this faster

## Data stuctures

- Array (string): fast O(1) for accessing by numerical index
- Hash table (dictionary): fast O(1) for accessing by key (any value, numerical / string / other)
- Set: fast O(1) for accessing by key (any value, numerical / string / other), but do NOT need a value associated with that key
- Tree
  - Binary search tree: fast O(log n) for accessing by sorted key, good for finding min / max / range of values in between X and Y
  - Trie: fast O(1) prefix / suffix searching
  - Heap: fast O(1) for accessing minimum OR maximum (depending on how it is built), O(log n) for insterting new values
- Graph: "connected data"
- Linked list: fast O(1) inserting / removing given a node
- Queue: fast O(1) for accessing "oldest insertion"
- Stack: fast O(1) for accessing "most recent insertion"

## Sorting

- Binary search
- Ratchet ("never backtrack")

Example problem: find whether exactly two numbers in the sorted array that add to the target.

```js
hasPairSum(16, [1,6,7,9,11]); // true
hasPairSum(14, [1,6,7,9,11]); // false
hasPairSum(2, [1,6,7,9,11]); // false

// O(n^2)
const hasPairSum = (target, nums) => {
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return true;
      }
    }
  }
  return false;
};

// work from both ends inward "ratcheting"
// O(n)
const hasPairSum = (target, nums) => {
  let leftIdx = 0;
  let rightIdx = nums.length - 1;
  while (leftIdx !== rightIdx) {
    const sum = nums[leftIdx] + nums[rightIdx];
    if (sum < target) {
      leftIdx++;
    } else if (sum > target) {
      rightIdx--;
    } else {
      return true;
    }
  }
  return false;
};

// iterativly subtract target with each number then binary search for that difference
// O(n * log n)
/*
(implement on your own if you want)
*/
```

## Hash maps are usually the right idea

Example problem: find whether exactly two numbers in the array that add to the target.

```js
hasPairSum(16, [1,6,7,9,11]); // true
hasPairSum(14, [1,6,7,9,11]); // false
hasPairSum(2, [1,6,7,9,11]); // false

// O(n)
const hasPairSum = (target, nums) => {
  const possibleDifferences = {};
  for (const num of nums) {
    if (possibleDifferences[target - num]) {
      return true;
    }
    possibleDifferences[num] = true;
  }
  return false;
};

// ...or the same idea but with a set
// O(n)
const hasPairSum = (target, nums) => {
  const possibleDifferences = new Set();
  for (const num of nums) {
    if (possibleDifferences.has(target - num)) {
      return true;
    }
    possibleDifferences.add(num);
  }
  return false;
};
```

## Dynamic programming

Involved recognizing overlapping subproblems, and not repeating execution for those overlaps.

- Bottom-up iterative approach (uses caching)
- Top-down recursive approach (uses memoization)
- "Tabular approach"

Usually we have an algorithm going through "all possibilities". And some of those overlap.

```js
// O(2^n)
const fib = (n) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
};
/*
                                      fib(5)
                    /                               \
               fib(4)                                fib(3)
             /         \                            /       \
         fib(3)          fib(2)                fib(2)         fib(1)
     /          \         /       \            /    \
  fib(2)         fib(1)  fib(1)   fib(0)   fib(1)  fib(0)
 /    \
fib(1) fib(0)
*/

// "top down" memoized (recursive)
// O(n)
const fib = (n, memo = {}) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (memo.hasOwnProperty(n)) return memo[n];
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  // store result for this number
  memo[n] = result;
  return result;
};
/*
                                      fib(5)
                    /                               \
               fib(4)                                fib(3)
             /         \             
         fib(3)          fib(2)
     /          \         
  fib(2)         fib(1)
 /    \
fib(1) fib(0)
*/

// "bottom up" caching (iterative)
// O(n)
const fib = (n) => {
  const cache = {
    0: 0,
    1: 1
  };
  for (let i = 2; i <= n; i++) {
    const result = cache[i - 1] + cache[i - 2];
    cache[i] = result;
  };
  return cache[n];
};
// ...or with an array
const fib = (n) => {
  const cache = [0, 1];
  for (let i = 2; i <= n; i++) {
    const result = cache[i - 1] + cache[i - 2];
    cache[i] = result;
  };
  return cache[n];
};
```

## Best way to study

- DO IT
- And then analyze it / talk about it
