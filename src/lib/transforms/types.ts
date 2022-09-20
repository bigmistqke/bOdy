export interface ObjectType {
  [key: string]: any
}

export type ArrayType = any[]
export type ValueType = string | number
export type AcceptedTypes = ObjectType | ArrayType | ValueType | any
