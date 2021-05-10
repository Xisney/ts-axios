import { AxiosRequestConfig, ResponesPromise } from '../types'
import { xhr } from './xhr'
import processConfig from './processConfig'

// 封装逻辑，提取流程
function dispatch(config: AxiosRequestConfig): ResponesPromise {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
  processConfig(config)

  return xhr(config)
}

export default dispatch
