import { AxiosRequestConfig } from './types'

export function xhr(config: AxiosRequestConfig): void {
  const { method = 'GET', params = '', data = null } = config
  const xhr = new XMLHttpRequest()
  xhr.open(method, config.url, true)
  xhr.send(data)
}
