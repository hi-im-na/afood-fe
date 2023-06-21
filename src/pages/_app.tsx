import Header from '@/components/layout/Header'
import Layout from '@/components/layout/layout'
import AuthProvider from '@/context/AuthProvider'
import { DrawerProvider } from '@/context/DrawerContext'
import '@/styles/globals.css'
import darkTheme from '@/theme/darkTheme'
import lightTheme from '@/theme/lightTheme'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { AppProps } from 'next/app'
import { createContext, useMemo, useState } from 'react'

const ColorModeContext = createContext({
  toggleColorMode: () => {},
})

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    []
  )

  const darkThemeChosen = useMemo(
    () =>
      createTheme({
        ...darkTheme,
      }),
    [mode]
  )
  const lightThemeChosen = useMemo(
    () =>
      createTheme({
        ...lightTheme,
      }),
    [mode]
  )

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider
          theme={mode === 'dark' ? darkThemeChosen : lightThemeChosen}
        >
          <AuthProvider>
            <DrawerProvider>
              <CssBaseline />
              <Header ColorModeContext={ColorModeContext} />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </DrawerProvider>
          </AuthProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  )
}
