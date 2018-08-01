const partiallyApply = (f, ...appliedArgs) => (...remainingArgs) =>
  f(...appliedArgs, ...remainingArgs);

// const partiallyApply = (f, ...args) => f.bind(null, ...args)
