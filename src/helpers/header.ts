import { isPlainObject } from './utils'

function normaliseHeader(header: any, target: string): void {
  if (!header) {
    return
  }

  Object.keys(header).forEach(name => {
    if (name !== target && name.toLocaleLowerCase() === target.toLocaleLowerCase()) {
      header[target] = header[name]
      delete header[name]
    }
  })
}

export function processHeader(header: any, data: any): any {
  normaliseHeader(header, 'Content-Type')

  if (isPlainObject(data)) {
    if (header && !header['Content-Type']) {
      header['Content-Type'] = 'application/json;charset=UTF-8'
    }
  }
  return header
}

// 解析响应头为对象
export function parseHeader(headers: string): object {
  const res = Object.create(null)

  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    value = value.trim()
    res[key] = value
  })
  return res
}
