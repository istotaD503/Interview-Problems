const iLL = (value, next) => {
  const list = {
    value,
    values: [value, ...(next ? next.values : [])],
    next: next || null,
    addToHead: v => iLL(v, list),
  };

  return list;
};
