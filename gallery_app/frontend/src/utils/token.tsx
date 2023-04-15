import { decodeToken } from 'react-jwt'
export const verifyToken = (token: string): boolean => {
  const myDecodedToken: any = decodeToken(token)
  const expiration = new Date(myDecodedToken.exp * 1000)
  console.log(`Token 🔐 : expiration date is  ${expiration}`)
  return new Date().getTime() - expiration.getTime() + 1200 < 0
}
