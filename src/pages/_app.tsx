import Layout from '@/components/layout/layout'
import { AuthProvider, ProtectedRoute } from '@/context/auth'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        {/* <ProtectedRoute> */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        {/* </ProtectedRoute> */}
      </AuthProvider>
    </>
  )
}
