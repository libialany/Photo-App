import Cookies, { CookieAttributes } from 'js-cookie'

export const saveCookie = (
  key: string,
  value: any,
  options?: CookieAttributes
) => {
  Cookies.set(key, value, options)
  console.log(`🍪 ✅`, key, value)
}

export const readCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

export const removeCookie = (key: string) => {
  console.log(`🍪 🗑`, key)
  return Cookies.remove(key)
}

export const removeCookies = () => {
  Object.keys(Cookies.get()).forEach((cookieName) => {
    console.log(`🍪 🗑`, cookieName)
    Cookies.remove(cookieName)
  })
}
