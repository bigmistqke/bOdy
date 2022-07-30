import fals from "fals";
import getType from "./getType";

const scaleArray = (a, scalar, log) => a.map((value, i) => scale(value, scalar, log));

const scaleObject = (a, scalar, log) =>
  Object.fromEntries(Object.entries(a).map(([key, value]) => ([key, scale(value, scalar, log)])))


export const scale = (a, scalar, log = false) => {
  if (fals(a)) return a;
  switch (getType(a)) {
    case "array":
      return scaleArray(a, scalar, log);
    case "object":
      return scaleObject(a, scalar, log);
    case "number":
      return a * scalar
    default:
      return a
  }
}