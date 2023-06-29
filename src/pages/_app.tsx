import Header from '@/components/layout/Header'
import Layout from '@/components/layout/layout'
import AuthProvider from '@/context/AuthProvider'
import { DrawerProvider } from '@/context/DrawerContext'
import '@/styles/globals.css'
import darkTheme from '@/theme/darkTheme'
import lightTheme from '@/theme/lightTheme'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/vi'
import type { AppProps } from 'next/app'
import { createContext, useMemo, useState } from 'react'
const ColorModeContext = createContext({
  toggleColorMode: () => {},
})

export default function App({ Component, pageProps, ...appProps }: AppProps) {
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

  if ([`/billPrint`].includes(appProps.router.pathname))
    return <Component {...pageProps} />

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider
          theme={mode === 'dark' ? darkThemeChosen : lightThemeChosen}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <AuthProvider>
              <DrawerProvider>
                <CssBaseline />
                <Header ColorModeContext={ColorModeContext} />
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </DrawerProvider>
            </AuthProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  )
}
