const cookie = {
  read(name: string): string | null {
    const target = document.cookie.match(new RegExp(`(^|;\\s*)(${name}=)([^;]*)`))
    return target ? decodeURIComponent(target[3]) : target
  }
}

export default cookie
