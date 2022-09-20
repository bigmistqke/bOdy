import { ObjectType, ArrayType, AcceptedTypes } from "./types"

const scaleObjects = (a: ObjectType, scalar: number) =>
  Object.fromEntries(
    Object.keys(a).map((key): [key: string, value: any] => [
      key,
      scale(a[key], scalar),
    ])
  )

const scaleArrays = <T extends ArrayType>(a: T, scalar: number): T =>
  a.map((a_value, i) => scale(a_value, scalar)) as T

export const scale = <T extends AcceptedTypes>(a: T, scalar: number): T => {
  if (a instanceof Array) {
    return scaleArrays(a, scalar) as T
  } else if (a instanceof Object) {
    return scaleObjects(a, scalar) as T
  } else {
    return (+a * scalar) as T
  }
}
