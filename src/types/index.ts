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
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  auth?: AxiosBasicCredentials
  baseURL?: string

  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  [key: string]: any
}

export interface AxiosResponse<T = any> {
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
  interceptors: {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  defaultConfig: AxiosRequestConfig

  request<T = any>(url: any, config: AxiosRequestConfig): ResponesPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): ResponesPromise<T>

  getUrl(config: AxiosRequestConfig): string
}

export interface AxiosInstance extends Axios {
  // axios函数重载
  <T = any>(config: AxiosRequestConfig): ResponesPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): ResponesPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

export interface InterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}

// 因为可能为响应或请求拦截器，使用泛型限制参数
export interface ResolvedFn<T> {
  // 限制promise resolve函数的类型
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// 限制CancelToken的类类型
export interface CancelTokenStatic {
  // 构造函数返回值为该类的实例对象
  // CancelToken用于限制实例对象
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

// 定义Cancel类封装错误，进行扩展
export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}
