import getType from "./getType";

const sumObjects = (a, b) =>
  Object.fromEntries(
    Object.keys(a).map((key) =>
      [
        key,
        sum(a[key], b[key])
      ])
  );

const sumArrays = (a, b) => a.map((a_value, i) => sum(a_value, b[i]));

export const sum = (a, b) => {
  if (!a || !b) {
    return a || b;
  }
  if (getType(a) !== getType(b)) {
    // console.error("summing two different types is not possible: ", a, b);
    return 0;
  }
  switch (getType(a)) {
    case "array":
      return sumArrays(a, b);
    case "object":
      return sumObjects(a, b);
    default:
      return a + b;
  }
};