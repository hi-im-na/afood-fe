import { useDrawer } from '@/context/DrawerContext'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Divider, IconButton, List, Toolbar } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import { mainListItems, secondaryListItems } from './menuItems'

const drawerWidth: number = 240

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)', // Gradient from light gray to slightly darker gray
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

export default function Sidebar() {
  const { isOpen, toggleDrawer } = useDrawer()

  return (
    <>
      <Drawer variant="permanent" open={isOpen}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
        </List>
      </Drawer>
    </>
  )
}
