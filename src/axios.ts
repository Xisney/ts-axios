import Axios from './core/Axios'
import { AxiosInstance } from './types'
import { merge } from './helpers/utils'

export function createAxios(): AxiosInstance {
  const context = new Axios()
  // 绑定函数内部的this为Axios对象实例，虽然本身不访问this，但是
  // 合并之后会访问
  let instance = context.request.bind(context)
  instance = merge(instance, context)

  return instance as AxiosInstance
}

const axios = createAxios()
export default axios
