# Prompt

You had a party yesterday and a lot of people showed up.

![Spongebob party](http://stream1.gifsoup.com/view/48923/jellyfish-jam-o.gif)

Given an array of guest attendance objects for that day, determine the hour block(s) of the day (0 through 23) which had the greatest total attendance, and what that attendance was. The possible hour blocks are:

```
00:00:00.000–00:59:59.999 (0)
01:00:00.000–01:59:59.999 (1)
02:00:00.000–02:59:59.999 (2)
...
22:00:00.000–22:59:59.999 (22)
23:00:00.000–23:59:59.999 (23)
```

Each guest attedance object will look something like:

```js
{
  guestId: '8f1h812', // unique id per guest
  entryTime: 1618341, // milliseconds since midnight
  exitTime: 7837432 // milliseconds since midnight
}
```

The array of these guest attendance objects will be sorted in ascending order by `entryTime`. I.e. the first guest to have arrived will be first in the array, and the last guest to have arrived will be last in the array.

You can convert from milliseconds to hours with the following formula: hours = milliseconds / 3600000.

Follow-up: what was the most-attended range (in milliseconds), and how many people were present during that range.

# Examples

In the example below, there are 7 guests throughout the day in general. At 18:00–19:00 and 19:00–20:00, 4 of those guests either arrive or are already present at some point during those 1-hour blocks of time.

```js
const attendanceData = [{
  guestId: '8f1h812',
  entryTime: 1618341, // equivalent to 00:26:58.341 (about 30 minutes after midnight)
  exitTime: 7837432 // equivalent to 02:10:37.432
}, {
  guestId: 'b1grg4qv2',
  entryTime: 2809923, // equivalent to 00:46:49.923
  exitTime: 3441062 // equivalent to 00:57:21.062
}, {
  guestId: 'ryk1be5wb',
  entryTime: 5990157, // equivalent to 01:39:50.157
  exitTime: 44643353 // equivalent to 12:24:03.353
}, {
  guestId: 'sywxzecwz',
  entryTime: 48269342, // equivalent to 13:24:29.342
  exitTime: 72921808 // equivalent to 20:15:21.808
}, {
  guestId: 'hkcwweqdz',
  entryTime: 62545139, // equivalent to 17:22:25.139
  exitTime: 72559348 // equivalent to 20:09:19.348
}, {
  guestId: 'hkybzn9vb',
  entryTime: 65720635, // equivalent to 18:15:20.635
  exitTime: 71058002 // equivalent to 19:44:18.002
}, {
  guestId: 'sjnmbn9db',
  entryTime: 66374698, // equivalent to 18:26:14.698
  exitTime: 73343681 // equivalent to 20:22:23.681
}, {
  guestId: 'ryrh0fowz',
  entryTime: 79567517, // equivalent to 22:06:07.517
  exitTime: 85015268 // equivalent to 23:36:55.268
}];

maxAttendance(attendanceData);
/*
should return...
{
  max: 4,
  hourBlocks: [18, 19]
}
*/
```

And for the follow-up:

```js
maxAttendance(attendanceData);
/*
should return...
{
  max: 4,
  from: 66374698, // equivalent to 18:26:14.698
  to: 71058002 // equivalent to 19:44:18.002
}
*/
```

# Solutions

For the first part of the problem, we could keep track of the maximum attendance for each hour block. In particular we could have an array with 24 blocks initialized to 0.

```js
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

For each guest, we can convert their `entryTime` and `exitTime` into hour blocks, then loop from the entry hour block up through the exit hour block, incrementing each max attendance in our hour block buckets array.

For example, if the first guest arrives at 5990157 (00:26:58.341) and leaves at 7837432 (02:10:37.432) we would convert those times into 0 and 2, respectively. Then we would loop from 0 through 2 and add one to the corresponding index in our array, resulting in:

```js
[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

We should also keep track of a running maximum, and any hour blocks whose max attendance matches that maximum.

Here's what that could look like:

```js
// convert a time-since-midnight, in milliseconds, into an hour block
function msToHourBlock (ms) {
  return Math.floor(ms / 3600000);
}

function maxAttendance (attendanceData) {
  // initialize the counters for all 24 hour blocks
  const hourBuckets = new Array(24).fill(0);
  // initialize the result to be 0 and all hour blocks
  const result = {
    max: 0,
    hourBlocks: hourBuckets.map((_, idx) => idx) // [0, 1, 2, ..., 22, 23]
  };
  // go through every guest in attendance
  attendanceData.forEach(guest => {
    const start = msToHourBlock(guest.entryTime);
    const end = msToHourBlock(guest.exitTime);
    // loop from their "arriving" hour block through their "leaving" hour block
    for (let hourBlock = start; hourBlock <= end; hourBlock++) {
      // increment each hour block they were present for
      const incremented = ++hourBuckets[hourBlock];
      if (incremented > result.max) {
        // if an hour block's attendance overtakes the current maximum
        // set the new max and new result set
        result.max = incremented;
        result.hourBlocks = [hourBlock];
      } else if (incremented === result.max) {
        // if an hour block's attendance matches the current maximum
        // include it in the result set
        result.hourBlocks.push(hourBlock);
      }
    }
  });
  return result;
}
```

The above solution should be `O(n)` time complexity where `n` is the size of the attendance data array. True there are nested loops above, but the inner loop is constrained by a constant—at its greatest, it would loop 24 times.

Its space complexity would be `O(1)`.

For the follow-up, this "bucketing" approach won't really work—there are way too many millisecond buckets throughout one day.

So instead we'll "simulate a house" by pushing guests into a dynamic array as they arrive, and filtering them out as they leave. The maximum attendance for the day will be the maximum size of that array.

```js
function maxAttendance (attendanceData) {
  // start with an empty house
  let house = [];
  // initizlie the result to be 0 for the whole day
  const result = {
    max: 0,
    from: 0,
    to: 86399999 // 23:59:59.999
  };
  // go through every guest
  attendanceData.forEach(newGuest => {
    // remove anybody from the house who left before this guest arrived
    house = house.filter(currentGuest => {
      return currentGuest.exitTime > newGuest.entryTime;
    });
    // add the new guest to the house
    house.push(newGuest);
    if (house.length > result.max) {
      // if the house now has more guests than ever before
      // set the new max and starting time
      result.max = house.length;
      result.from = newGuest.entryTime;
      // also find out who the next person to leave is in order to set the ending time
      result.to = Math.min(...house.map(currentGuest => currentGuest.exitTime));
    }
  });
  return result;
}
```

This solution is `O(n * p)` time complexity, where `n` is the size of the attendance data array and `p` is the average house occupancy throughout the day. This is because we have nested loops, where the outer loop iterates `n` times and the inner loops iterates `p` times.

The space complexity would be `O(q)` where `q` is the maximum occupancy. The driving factor here is the `house` array above, which will max out it size equivalent to our maximum occupancy.

*Side note: if we assume the average house occupancy has some consistent linear relationship to the attendance data array size (e.g. "the average occupancy tends to be 1/50th of the attendance list"), then `p = n` and `q = n` for our big O calculations. Meaning our time complexity could probably be specified as `O(n^2)`.*

Could we improve upon this time complexity? Well the driving factor seems to be *finding/removing people from the house when they leave*. These people will have the soonest `exitTime`. It's like we want to have a "house" that keeps the guests who are leaving soon closest to the door.

If only we had a way to easily find / remove the minimum values in a data set...

![Sponegebob crying](http://www.cactushugs.com/wp-content/uploads/2015/10/SpongeBob-Crying.gif)

Oh wait we do.

![Spongebob rainbow, heaps](http://i.imgur.com/fawcboy.jpg)

In a min heap, the minimum value will be constant time to find, and logarithmic time to remove. Here's what that solution would look like if we were using a binary min heap for our house:

```js
function maxAttendance (attendanceData) {
  // start with an empty house
  const house = new BinaryMinHeap();
  // initizlie the result to be 0 for the whole day
  const result = {
    max: 0,
    from: 0,
    to: 86399999 // 23:59:59.999
  };
  // go through every guest
  attendanceData.forEach(newGuest => {
    // remove anybody from the house who left before this guest arrived
    while (house.size() > 0 && house.peekMin().exitTime <= newGuest.entryTime) {
      house.popMin();
    }
    // add the new guest to the house
    house.insert(newGuest, newGuest.exitTime);
    if (house.size() > result.max) {
      // if the house now has more guests than ever before
      // set the new max and starting time
      result.max = house.size();
      result.from = newGuest.entryTime;
      // also find out who the next person to leave is in order to set the ending time
      result.to = house.peekMin().exitTime;
    }
  });
  return result;
}
```

With a properly-implemented heap, this solution should be `O(n log p)` time complexity, where (as before) `n` is the size of the attendance data array and `p` is the average house occupancy throughout the day. (Or, as stated earlier, `O(n log n)` if we're assuming `n` and `p` are related by some constant linear factor.)

The space complexity would still be `O(q)` where `q` is the maximum occupancy.

The beauty of assuming an existing `BinaryMinHeap` class is twofold: 1) our code is more modular, more succinct, and easier to reason about; 2) if we forget exactly how to implement a min heap we can at least solve the *rest* of the problem.

For reference, if asked to implement a min heap, it could look something like:

```js
class BinaryMinHeap {
  constructor () {
    this.array = [null];
  }
  size () {
    return this.array.length - 1;
  }
  insert (data, priority) {
    this.array.push({data, priority});
    let currentChild = this.array.length - 1;
    this.heapifyUp(currentChild);
  }
  peekMin () {
    return this.array[1].data;
  }
  popMin () {
    const min = this.array[1];
    if (this.size() === 1) {
      this.array.pop();
      return min;
    }
    const rootIdx = 1;
    this.array[1] = this.array.pop();
    this.heapifyDown(rootIdx);
    return min.data;
  }
  heapifyDown (rootIdx) {
    let currentParent = rootIdx;
    let [l, r] = this.childrenIdx(currentParent);
    let idxSmaller;
    const length = this.array.length;
    while (l < length) {
      if (r < length) {
        idxSmaller = this.priority(l) <= this.priority(r) ? l : r;
      }
      else idxSmaller = l;

      if (this.priority(currentParent) > this.priority(idxSmaller)) {
        this.swap(idxSmaller, currentParent);
        currentParent = idxSmaller;
        [l, r] = this.childrenIdx(currentParent);
      }
      else return;
    }
  }
  heapifyUp (deepestIdx) {
    let currentChild = deepestIdx;
    while (this.parentIdx(currentChild) && this.array[currentChild].priority < this.array[this.parentIdx(currentChild)].priority) {
      this.swap(currentChild, this.parentIdx(currentChild));
      currentChild = this.parentIdx(currentChild);
    } 
  }
  swap (childIdx, parentIdx) {
    [this.array[childIdx], this.array[parentIdx]] = [this.array[parentIdx], this.array[childIdx]];
  }
  parentIdx (childIdx) {
    return Math.floor(childIdx / 2);
  }
  childrenIdx (parentIdx) {
    return [parentIdx * 2, parentIdx * 2 + 1];
  }
  priority (i) {
    return this.array[i].priority;
  }
}
```
