import Axios from './core/Axios'
import { AxiosInstance, AxiosRequestConfig } from './types'
import { merge } from './helpers/utils'
import defaultConfig from './default'

export function createAxios(initConfig: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(initConfig)
  // 绑定函数内部的this为Axios对象实例，虽然本身不访问this，但是
  // 合并之后会访问
  let instance = context.request.bind(context)
  instance = merge(instance, context)

  return instance as AxiosInstance
}

const axios = createAxios(defaultConfig)
export default axios
