import { AxiosRequestConfig, AxiosResponse } from '../types'

// 使用AxiosError类封装详细错误信息
export class AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean

  constructor(
    msg: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(msg)
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 防止出现未知错误
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createAxiosError(
  msg: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  return new AxiosError(msg, config, code, request, response)
}
