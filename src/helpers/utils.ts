const toString = Object.prototype.toString

export function isDate(args: any): args is Date {
  return toString.call(args) === '[object Date]'
}

export function isPlainObject(args: any): args is Object {
  return args !== null && toString.call(args) === '[object Object]'
}
