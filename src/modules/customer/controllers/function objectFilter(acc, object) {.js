function objectFilter(acc, object) {
  const value = Object.values(object)[0];
  const key = Object.keys(object)[0];

  if (value) {
    return (acc[key] = value);
  }

  return acc;
}

const obje = { a: 1, b: 2, c: null };
const x = Object.entries(obje).reduce(
  (a, [k, v]) => (v ? ((a[k] = v), a) : a),
  {},
);
console.log(x);
