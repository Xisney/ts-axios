import { isDate, isPlainObject } from './utils'

export function encode(args: string): string {
  return encodeURIComponent(args)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || val === undefined) {
      // 跳出当前回调函数
      return
    }
    let values: string[]
    // 将value都装入数组，统一处理
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let formatParams = parts.join('&')
  if (formatParams) {
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.substring(0, hashIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + formatParams
  }
  return url
}

type URLOrigin = string

export function isURlSameOrigin(requestUrl: string): boolean {
  const requestOrigin = resolveURl(requestUrl)
  const currentOrigin = location.origin
  return requestOrigin === currentOrigin
}

function resolveURl(requestUrl: string): URLOrigin {
  const a = document.createElement('a')
  a.href = requestUrl
  return a.origin
}

export function isFormData(val: any): val is FormData {
  return val && val instanceof FormData
}
