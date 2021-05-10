import { Canceler, CancelExecutor } from '../types'
import Cancel from '../cancel/Cancel'

interface ResolvePromise {
  (reason: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    // 通过参数将取消的函数传递到外界
    executor(message => {
      if (this.reason !== undefined) {
        return
      }
      this.reason = new Cancel(message || '')
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason !== undefined) {
      throw new Cancel('this token has been used')
    }
  }

  static source() {
    let cancel!: Canceler
    const token = new CancelToken(c => (cancel = c))
    return {
      token,
      cancel
    }
  }
}
