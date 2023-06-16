import { fetchSelf, postLogin } from '@/services/userApi'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const resToken = await postLogin(
          credentials!.username,
          credentials!.password
        )
        const userInfo = await fetchSelf(resToken.token)
        const user = { ...resToken, ...userInfo }
        if (user) {
          return user as any
        } else {
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      session.user = token as any
      return session
    },
  },
})
