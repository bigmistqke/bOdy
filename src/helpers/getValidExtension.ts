export default (file: string, validExtensions: string[]) => {
  if (!file) return false
  const extension = file.split(".").pop()?.toLowerCase()
  if (!extension) return false
  return validExtensions.indexOf(extension) !== -1 ? extension : false
}
