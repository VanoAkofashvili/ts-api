export function omit<T extends object>(obj: T) {
  return function <K extends Extract<keyof T, string>>(...keys: K[]): Omit<T, K> {
    let ret: any = {};
    const excludeSet: Set<string> = new Set(keys);
    for (let key in obj) {
      if (!excludeSet.has(key)) {
        ret[key] = obj[key];
      }
    }
    return ret;
  }
}