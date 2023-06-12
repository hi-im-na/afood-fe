import { DrawerProvider } from '@/context/DrawerContext'
import { Box, Container, CssBaseline, Toolbar } from '@mui/material'
import { ReactNode } from 'react'
import Header from '../layout/Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Props } from '@/utils/interfaces'

export default function Layout({ children }: Props) {
  return (
    <>
      <CssBaseline />
      <DrawerProvider>
        <Header />
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Sidebar />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              pl: 2,
            }}
          >
            <Toolbar />
            {children}
          </Box>
        </Box>
        <Footer />
      </DrawerProvider>
    </>
  )
}
