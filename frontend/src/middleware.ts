import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = (req: NextRequest) => {
  // const token = req.cookies.get('access_token')
  // console.log(`token middleware 🔐️: ${token?.value}`, req.nextUrl.pathname)

  try {
    if (req.nextUrl.pathname == '/') {
      const url = req.nextUrl.clone()
      url.pathname = '/album'
      return NextResponse.redirect(url)
    }
  } catch (e) {
    console.log(`Error in the middleware`, e)
    const url = req.nextUrl.clone()
    url.pathname = '/album'
    return NextResponse.redirect(url)
  }
}

// Supports both a single string value or an array of matchers.
export const config = {
  matcher: ['/'],
}
