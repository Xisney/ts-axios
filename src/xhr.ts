import { AxiosRequestConfig, ResponesPromise } from './types'
import { transformResponse } from './helpers/data'
import { parseHeader } from './helpers/header'

export function xhr(config: AxiosRequestConfig): ResponesPromise {
  return new Promise((resolve, reject) => {
    const { method = 'GET', data = null, headers = null, responseType = '' } = config
    const xhr = new XMLHttpRequest()
    xhr.open(method.toUpperCase(), config.url, true)

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        xhr.setRequestHeader(name, headers[name])
      }
    })
    xhr.responseType = responseType
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const data = transformResponse(xhr.response)
        const status = xhr.status
        const statusText = xhr.statusText
        const headers = parseHeader(xhr.getAllResponseHeaders())
        resolve({
          data,
          status,
          statusText,
          headers,
          config
        })
      }
    }
    xhr.send(data)
  })
}
