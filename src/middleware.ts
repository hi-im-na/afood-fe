// export { default } from "next-auth/middleware";
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { nextUrl, nextauth } = req

    if (
      nextUrl.pathname.match('/addOrder') &&
      nextauth.token?.role !== 'ROLE_MANAGER' &&
      nextauth.token?.role !== 'ROLE_ADMIN' &&
      nextauth.token?.role !== 'ROLE_STAFF'
    ) {
      return NextResponse.redirect(new URL('/403', req.url))
    }

    if (
      nextUrl.pathname.match('/order') &&
      nextauth.token?.role !== 'ROLE_MANAGER' &&
      nextauth.token?.role !== 'ROLE_ADMIN'
    ) {
      return NextResponse.redirect(new URL('/403', req.url))
    }
    if (
      (nextUrl.pathname.match('/staffs') ||
        nextUrl.pathname.match('/seniority') ||
        nextUrl.pathname.match('/staffEarnings') ||
        nextUrl.pathname.match('/income') ||
        nextUrl.pathname.match('/timekeeping')) &&
      nextauth.token?.role !== 'ROLE_ADMIN'
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
  matcher: [
    '/income:path*',
    '/order:path*',
    '/addOrder:path*',
    '/staffs:path*',
    '/timekeeping:path*',
    '/seniority:path*',
  ],
}
