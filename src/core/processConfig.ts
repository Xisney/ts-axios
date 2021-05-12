import { AxiosRequestConfig } from '../types'
import { buildUrl, combineURL, isAbsoluteURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/utils'
import transform from './transform'

export default function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config

  if (!isAbsoluteURL(url!) && baseURL) {
    url = combineURL(baseURL, url!)
  }
  return buildUrl(url!, params, paramsSerializer)
}
