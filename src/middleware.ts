// export { default } from "next-auth/middleware";
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log('token: ', req.nextauth.token)

    if (
      req.nextUrl.pathname.match('/addOrder') &&
      req.nextauth.token?.role !== 'ROLE_MANAGER'
    )
      return NextResponse.redirect(new URL('/403', req.url))

    if (
      req.nextUrl.pathname.match('/order') &&
      req.nextauth.token?.role !== 'ROLE_MANAGER'
    )
      return NextResponse.redirect(new URL('/403', req.url))
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/addOrder:path*', '/order:path*'],
}
