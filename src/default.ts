import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  // 默认没有超时限制
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  }
}

const methodsWithoutData = ['delete', 'get', 'head', 'options']

methodsWithoutData.forEach(key => {
  defaults.headers[key] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(key => {
  defaults.headers[key] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
