import { DrawerProvider } from '@/context/DrawerContext'
import { Props } from '@/utils/interfaces'
import { Box, CssBaseline, Toolbar } from '@mui/material'
import Header from '../layout/Header'
import Sidebar from './Sidebar'

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
              background: 'linear-gradient(to bottom, #ffffff, #eaf2f0)', // Gradient from white to light gray
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              p: 2,
            }}
          >
            <Toolbar />
            {children}
          </Box>
        </Box>
      </DrawerProvider>
    </>
  )
}
