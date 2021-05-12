import { Method } from '../types'

const toString = Object.prototype.toString

export function isDate(args: any): args is Date {
  return toString.call(args) === '[object Date]'
}

export function isPlainObject(args: any): args is Object {
  return args !== null && toString.call(args) === '[object Object]'
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return val && val instanceof URLSearchParams
}

// 将两者合并，类型联合
export function merge<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  const res = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          // 多个对象可能已经存在key
          if (isPlainObject(res[key])) {
            res[key] = deepMerge(res[key], val)
          } else {
            res[key] = deepMerge(val)
          }
        } else {
          res[key] = val
        }
      })
    }
  })
  return res
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(key => {
    delete headers[key]
  })

  return headers
}
