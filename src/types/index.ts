export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'head'
  | 'HEAD'
  | 'DELETE'
  | 'delete'
  | 'options'
  | 'OPTIONS'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  params?: any
  data?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse<T> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
}

// 限制resolve的参数是AxiosResponse类型
export interface ResponesPromise<T = any> extends Promise<AxiosResponse<T>> {}

// 定义错误类型接口
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse<any>
  isAxiosError: boolean
}

// 扩展axios
export interface Axios {
  request<T = any>(config: AxiosRequestConfig): ResponesPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise<T>
}

export interface AxiosInstance extends Axios {
  // axios函数重载
  <T = any>(config: AxiosRequestConfig): ResponesPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>
}
