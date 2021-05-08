import { AxiosRequestConfig, ResponesPromise } from '../types'
import { xhr } from './xhr'
import processConfig from './processConfig'

// 封装逻辑，提取流程
function dispatch(config: AxiosRequestConfig): ResponesPromise {
  processConfig(config)
  return xhr(config)
}

export default dispatch
