export default function convertFieldsToString(
  obj: Record<string, any>
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      result[key] = value !== null ? `${value}` : ''
    }
  }

  return result
}
