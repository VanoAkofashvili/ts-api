export function isEmpty(object: object): boolean {
  for (let i in object) return false;
  return true;
}