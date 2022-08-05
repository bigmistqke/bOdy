import getType from "./getType";

const sumObjects = (a, b, positive) =>
  Object.fromEntries(
    Object.keys(a).map((key) =>
      [
        key,
        sum(a[key], b[key], positive)
      ])
  );

const sumArrays = (a, b, positive) => a.map((a_value, i) => sum(a_value, b[i], positive));

export const sum = (a, b, positive = true) => {
  if (!a || !b) {
    return a || b;
  }
  switch (getType(a)) {
    case "array":
      return sumArrays(a, b, positive);
    case "object":
      return sumObjects(a, b, positive);
    default:
      return positive ? +a + +b : +a - +b;
  }
};