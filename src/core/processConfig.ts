import { AxiosRequestConfig } from '../types'
import { buildUrl } from '../helpers/url'
import { flattenHeaders } from '../helpers/utils'
import transform from './transform'

export default function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url!, params)
}
