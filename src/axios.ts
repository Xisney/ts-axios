import Axios from './core/Axios'
import { AxiosRequestConfig, AxiosStatic } from './types'
import { merge } from './helpers/utils'
import defaultConfig from './default'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

export function createAxios(initConfig: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(initConfig)
  // 绑定函数内部的this为Axios对象实例，虽然本身不访问this，但是
  // 合并之后会访问
  let instance = context.request.bind(context)
  instance = merge(instance, context)

  return instance as AxiosStatic
}
const axios = createAxios(defaultConfig)

axios.create = function(config) {
  return createAxios(mergeConfig(defaultConfig, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios
