# Data Structures

## ADT vs. DS

### ADT: Abstract Data Type
- specification
  - blueprint: "_what_ I need"
  - interface
- what you can _do_ with the data
- how the data relate to each other

### DS: Data Structure
- *implementation*
  - "_how_ we build it"
- how we can represent a particular ADT in the computer's memory

## Lists
- _ordered_ collection of items / elements

### Stack
- Last-In First-Out (LIFO)
- Examples:
  - pancakes!
  - undo/redo stacks
    - backspace two characters
    - add word 'foo'
    - add newline character
  - browser history
    - back/forward
#### Implementation
- array
  - push:
    - add the new element to the next empty space in the array (at the end)
  - pop:
    - find the last occupied space in the array, remove it
- dynamic array / array list
  - array that will resize itself when we run out of space
    - resizing is amortized
  - when we are out of space, make a new array w/ double the size and copy old elements into it
- linked-list
  - collection of nodes, each of which has a value and a pointer (or pointers) to neighbors in the list
  - could be singly-linked (unidirectional) or doubly (bidirectional)
- linked lists vs. arrays
  - lookup:
    - constant for arrays
    - linear for linked-lists
  - size:
    - arrays need to be fixed
      - might need to resize them (dynamic arrays) which can be expensive
    - linked-lists don't care, flexible
      - insert as many items in as you like
    - insertion:
      - arrays: constant-time insertion (for the end or any specific position)
        - expensive to insert something between two neighbors
          - shift everything down a space (and maybe resize)
      - linked-list: insertion in a singly-linked list is linear
        - inserting between two existing items is easy
          - just change the pointers
### Queue
- First-In First-Out
- might be easier to implement w/ a linked-list
  - especially if you're keeping a `head` and `tail` pointer

### JS Array
- really more of an ADT than DS
  - we know how to interact w/ it
  - methods
    - push
    - pop
    - shift
    - unshift
    - forEach, map, reduce, etc.
  - don't really know how it's stored internally
    - hash table?
    - actual array?
    - 

## Sets
- _unordered_ collection of _unique_ values
- operations:
  - checking for membership
    - `has` in [JS Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  - insertion
    - `add` in JS Set
- implementation
  - hash table
    - array buckets only ever store `true`/`false`
      - 1/0 for a single bit
  - [Bloom filter?](https://en.wikipedia.org/wiki/Bloom_filter)
    - only if some rate of false positives is acceptable
    - very efficient

## Trees

### [Heaps](https://en.wikipedia.org/wiki/Heap_(data_structure))
- specific type of tree
  - generally specified as either a "max heap" or a "min heap"
- maintains an ordering between parent and child
  - but not across siblings or levels
- operations
  - popMin / popMax
  - add
  - every operation involves restructuring the heap
    - "heapifying"
    - logarithmic operation
- great for solving problems where we only ever care about the next lowest/highest value
  - [heap sort](https://en.wikipedia.org/wiki/Heapsort)

### [Tries](http://homes.soic.indiana.edu/classes/fall2016/csci/h343-yye/img/alphabettrie.png)
- efficient way to store strings
  - reuse substrings we've seen before
- great for predictive auto-completion

## Graphs
- consist of "vertices" (singular "vertex", i.e. "node") and "edges" (connections)
- directed vs. undirected
  - [directed](https://upload.wikimedia.org/wikipedia/commons/4/4b/Directed_acyclic_graph.svg) means edges must specify a direction
    - i.e. can traverse from A to B, but not from B to A
    - edges can be bi-directional
  - [undirected](https://qph.fs.quoracdn.net/main-qimg-da364413929fb5ec1185c523b29060d7) means every connection is two-way
- weigthed vs. unweighted
  - [weighted](https://i.stack.imgur.com/VW9yr.png) graphs assign a value to each edge
- linked-lists and trees are really specific types of graphs
- examples:
  - Git: directed, unweighted
    - every commit points to its parent
    - parent doesn't know about its children
  - Facebook: undirected
    - all of your friends are also friends with you
  - Twitter: directed
    - you can follow someone w/out them following you back
- traversal
  - breadth-first search: fewest number of nodes between source and destination
    - LinkedIn: how many degrees of separation are you from someone else?
  - weighted graphs: lowest total value between two nodes
    - [Dijkstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
    - [A*](https://en.wikipedia.org/wiki/A*_search_algorithm) (pronounced "A star")
    - maps apps: shortest path between two addresses / intersections