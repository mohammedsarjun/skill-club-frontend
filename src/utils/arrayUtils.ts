export function detectArrayType(arr:any[]) {
  if (!Array.isArray(arr)) return "Not an array";
  if (arr.length === 0) return "Empty array";

  const allStrings = arr.every(item => typeof item === "string");
  const allObjects = arr.every(item => typeof item === "object" && item !== null && !Array.isArray(item));

  return allStrings ? "Array of strings" : allObjects ? "Array of objects" : "Mixed array";
}

