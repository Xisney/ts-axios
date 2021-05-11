import { AxiosRequestConfig, ResponesPromise } from '../types'
import { parseHeader } from '../helpers/header'
import { createAxiosError } from '../helpers/error'
import transform from './transform'
import Cancel from '../cancel/Cancel'
import { isFormData, isURlSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'

export function xhr(config: AxiosRequestConfig): ResponesPromise {
  return new Promise((resolve, reject) => {
    const {
      method = 'GET',
      data = null,
      headers = null,
      responseType = '',
      timeout = 0,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const xhr = new XMLHttpRequest()
    xhr.open(method.toUpperCase(), config.url!, true)

    configXHR()
    configHeaders()
    bindEvent()
    handleCancel()

    function configXHR(): void {
      xhr.responseType = responseType
      xhr.timeout = timeout

      if (withCredentials) {
        xhr.withCredentials = withCredentials
      }
    }

    function configHeaders(): void {
      if ((withCredentials || isURlSameOrigin(config.url!)) && xsrfCookieName) {
        const token = cookie.read(xsrfCookieName)
        if (token) {
          headers[xsrfHeaderName!] = token
        }
      }

      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if (auth) {
        headers['Authorization'] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          xhr.setRequestHeader(name, headers[name])
        }
      })
    }

    function bindEvent(): void {
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

          if (validateStatus!(status)) {
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

      if (onDownloadProgress) {
        // 接受数据时的进度
        xhr.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        // 上传数据时的进度
        xhr.upload.onprogress = onUploadProgress
      }
    }

    function handleCancel(): void {
      // 控制xhr，使之可以取消
      if (cancelToken) {
        cancelToken.promise.then(msg => {
          xhr.abort()
          reject(new Cancel(`${msg.message}`))
        })
      }
    }

    xhr.send(data)
  })
}
