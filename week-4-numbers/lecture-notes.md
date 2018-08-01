```js
// function lastDigitAfterMultiplying(nums) {
//   let result = 1;
//   for (let i = 0; i < nums.length; i++) {
//     result = (result * (nums[i] % 10)) % 10;
//   }
//   return result;
// }

const lastDigitAfterMultiplying = nums =>
  nums.reduce((lastDig, n) => (lastDig * (n % 10)) % 10, 1);

lastDigitAfterMultiplying([2, 4, 5]); // => 0
lastDigitAfterMultiplying([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]); // => 4
lastDigitAfterMultiplying([7, 9, 6, 6, 7, 5, 2]); // => ???
lastDigitAfterMultiplying([567, 143, 88, 192, 3333356, 9, 801029]); // => 6
```

111111111111111111
001110100010110101

---

110001011101001010

## 1001
