import { AxiosRequestConfig, ResponesPromise, Method } from '../types'
import dispatchRequest from './dispatch'

export default class Axios {
  // axios实际调用该函数,但是不必修改实际Axios关于该方法的接口
  request(url: any, config: any): ResponesPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  get(url: string, config?: AxiosRequestConfig): ResponesPromise {
    return this._sendRequest('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): ResponesPromise {
    return this._sendRequest('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): ResponesPromise {
    return this._sendRequest('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): ResponesPromise {
    return this._sendRequest('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise {
    return this._sendRequestData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise {
    return this._sendRequestData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise {
    return this._sendRequestData('patch', url, data, config)
  }

  private _sendRequest(method: Method, url: string, config?: AxiosRequestConfig): ResponesPromise {
    return dispatchRequest(Object.assign(config || {}, { url, method }))
  }

  private _sendRequestData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): ResponesPromise {
    return dispatchRequest(Object.assign(config || {}, { url, data, method }))
  }
}
