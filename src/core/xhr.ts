import { AxiosRequestConfig, ResponesPromise } from '../types'
import { transformResponse } from '../helpers/data'
import { parseHeader } from '../helpers/header'
import { createAxiosError } from '../helpers/error'
import transform from './transform'
import Cancel from '../cancel/Cancel'

export function xhr(config: AxiosRequestConfig): ResponesPromise {
  return new Promise((resolve, reject) => {
    const {
      method = 'GET',
      data = null,
      headers = null,
      responseType = '',
      timeout = 0,
      cancelToken
    } = config

    const xhr = new XMLHttpRequest()
    xhr.open(method.toUpperCase(), config.url!, true)

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        xhr.setRequestHeader(name, headers[name])
      }
    })

    xhr.responseType = responseType
    xhr.timeout = timeout

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const status = xhr.status
        const statusText = xhr.statusText
        const headers = parseHeader(xhr.getAllResponseHeaders())
        const data = transform(xhr.response, headers, config.transformResponse)
        const response = {
          data,
          status,
          statusText,
          headers,
          config
        }
        // 排除已经处理的错误，超时或网络错误
        if (status === 0) return

        if ((status >= 200 && status < 300) || status === 304) {
          resolve(response)
        } else {
          reject(
            createAxiosError(
              `Request failed with status code ${status}`,
              config,
              statusText,
              xhr,
              response
            )
          )
        }
      }
    }

    xhr.onerror = () => {
      reject(createAxiosError('network error', config, null, xhr))
    }

    xhr.ontimeout = () => {
      reject(createAxiosError('request timeout', config, 'ECONNABORTED', xhr))
    }

    // 控制xhr，使之可以取消
    if (cancelToken) {
      cancelToken.promise.then(msg => {
        xhr.abort()
        reject(new Cancel(`${msg.message}`))
      })
    }

    xhr.send(data)
  })
}
