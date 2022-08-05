const getType = (a) => Array.isArray(a) ? "array" : typeof a
export default getType
