import {
  AxiosRequestConfig,
  ResponesPromise,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest from './dispatch'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => ResponesPromise)
  rejected?: RejectedFn
}

export default class Axios {
  interceptors: Interceptors
  defaultConfig: AxiosRequestConfig

  constructor(initConfig: AxiosRequestConfig) {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
    this.defaultConfig = initConfig
  }

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

    config = mergeConfig(this.defaultConfig, config)

    return this._runInterceptor(config)
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
    config = mergeConfig(this.defaultConfig, config)

    return this._runInterceptor(Object.assign(config || {}, { url, method }))
  }

  private _sendRequestData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): ResponesPromise {
    config = mergeConfig(this.defaultConfig, config)
    return this._runInterceptor(Object.assign(config || {}, { url, data, method }))
  }

  private _runInterceptor(config: any): ResponesPromise {
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // 装配拦截器
    this.interceptors.request.foreach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.foreach(interceptor => {
      chain.push(interceptor)
    })

    let res = Promise.resolve(config)

    // 利用promise链式调用，起手为promise，一直传递
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      // 在resolved函数中抛出异常将会返回一个拒绝的期约
      // 如果只是返回一个一个错误对象，任然会用解决的期约包装
      res = res.then(resolved, rejected)
    }

    return res
  }
}
