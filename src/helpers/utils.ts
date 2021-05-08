const toString = Object.prototype.toString

export function isDate(args: any): args is Date {
  return toString.call(args) === '[object Date]'
}

export function isPlainObject(args: any): args is Object {
  return args !== null && toString.call(args) === '[object Object]'
}

// 将两者合并，类型联合
export function merge<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
