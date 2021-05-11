import { AxiosRequestConfig } from './types'
import { processHeader } from './helpers/header'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',
  // 默认没有超时限制
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  },
  transformRequest: [
    function(data: any, headers: any): any {
      processHeader(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any) {
      return transformResponse(data)
    }
  ],
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  validateStatus: (status: number) => {
    return status >= 200 && status < 300
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
