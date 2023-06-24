import ThemeToggleButton from '@/components/ThemeToggleButton/ThemeToggleButton'
import { AccountCircle, ExitToApp, Restaurant } from '@mui/icons-material'
import { useMediaQuery } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { signIn, signOut, useSession } from 'next-auth/react'
import * as React from 'react'

export type HeaderProps = {
  ColorModeContext: React.Context<{ toggleColorMode: () => void }>
}

const drawerWidth = 240

const Header = (props: HeaderProps) => {
  const { ColorModeContext } = props
  const { data: session } = useSession()
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const tabletCheck = useMediaQuery('(min-width: 768px)')
  const mobileCheck = useMediaQuery('(min-width: 600px)')

  return (
    <>
      <AppBar position="fixed" sx={{ marginBottom: '40px' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Restaurant sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              AFood
            </Typography>
            <Restaurant sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              AFood
            </Typography>
            <Box sx={{ paddingRight: 5, marginLeft: 'auto' }}>
              {tabletCheck}
              <ThemeToggleButton ColorModeContext={ColorModeContext} />
            </Box>
            {!session ? (
              <Button
                variant="contained"
                color="inherit"
                onClick={() => signIn()}
              >
                Sign in
              </Button>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open profile settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <AccountCircle fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() =>
                      session ? signOut({ callbackUrl: '/' }) : signIn()
                    }
                  >
                    {/* <Typography textAlign="center"> */}
                    <ExitToApp />
                    {session ? 'Logout' : 'Login'}
                    {/* </Typography> */}
                  </MenuItem>
                </Menu>
                <Typography component="span">
                  {' ' + session?.user?.username}
                </Typography>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        position="static"
        sx={{ height: mobileCheck ? 64 : 57, mb: '40px' }}
      />
    </>
  )
}
export default Header
