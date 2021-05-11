import { deepMerge, isPlainObject } from '../helpers/utils'
import { AxiosRequestConfig } from '../types'

const stratHash = Object.create(null)

// 默认策略从config2取
function defaultStrat(config1: any, config2: any): any {
  return config2 === undefined ? config1 : config2
}

// 只取自定义配置
function fromConfig2Strat(config1: any, config2: any): any {
  return config2
}

// 合并复杂对象，优先自定义
function deepMergeStrat(config1: any, config2: any): any {
  if (isPlainObject(config2)) {
    return deepMerge(config1, config2)
  } else if (config2 !== undefined) {
    return config2
  } else if (isPlainObject(config1)) {
    return deepMerge(config1)
  } else {
    return config1
  }
}

// // transformer合并策略
// function transformerStrat(config1: any, config2: any): any {
//   return config1.concat(config2 === undefined ? [] : config2)
// }

const stratCustom = ['url', 'params', 'data']
const deepStrat = ['headers', 'auth']
// const transStrat = ['transformRequest', 'transformResponse']

stratCustom.forEach(key => {
  stratHash[key] = fromConfig2Strat
})

deepStrat.forEach(key => {
  stratHash[key] = deepMergeStrat
})

// transStrat.forEach(key => {
//   stratHash[key] = transformerStrat
// })

export default function mergeConfig(config1: AxiosRequestConfig, config2: AxiosRequestConfig = {}) {
  const config = Object.create(null)

  Object.keys(config2).forEach(key => {
    mergeField(key)
  })

  Object.keys(config1).forEach(key => {
    if (!config2[key]) {
      mergeField(key)
    }
  })

  function mergeField(key: string) {
    const strat = stratHash[key] || defaultStrat
    config[key] = strat(config1[key], config2[key])
  }
  return config
}
