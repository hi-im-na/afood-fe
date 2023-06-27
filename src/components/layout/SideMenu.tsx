import {
  EditCalendar,
  Equalizer,
  MenuBook,
  People,
  PostAdd,
  ReceiptLong,
  RequestQuote,
  TableRestaurant,
} from '@mui/icons-material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import IconButton from '@mui/material/IconButton'
import { CSSObject, useTheme } from '@mui/material/styles'
import NextLink from 'next/link'
import * as React from 'react'
import scss from './SideMenu.module.scss'

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  useMediaQuery,
} from '@mui/material'
import { headerHeight } from '@/utils/globalVariables'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const menuRouteList = [
  'income',
  'menu',
  'table',
  'order',
  'addOrder',
  'staff',
  'timekeeping',
  'salary',
]
const menuListTranslations = [
  'Income',
  'Menus',
  'Tables',
  'Orders',
  'Add order',
  'Staffs management',
  'Timekeeping',
  'Salary Management',
]
const menuListIcons = [
  <Equalizer />,
  <MenuBook />,
  <TableRestaurant />,
  <ReceiptLong />,
  <PostAdd />,
  <People />,
  <EditCalendar/>,
  <RequestQuote />,
]

const menuFilter = (role: string) => {
  switch (role) {
    case 'ROLE_ADMIN':
      return [0, 1, 2, 3, 4, 5, 6, 7]
    case 'ROLE_MANAGER':
      return [1, 2, 3, 4, 5]
    case 'ROLE_STAFF':
      return [1, 2, 4]
    default:
      return [1, 2]
  }
}

interface SideMenuProps {
  role: string
}

const SideMenu = ({ role }: SideMenuProps) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const mobileCheck = useMediaQuery('(min-width: 600px)')

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleListItemButtonClick = (text: string) => {
    // text === 'Sign Out' ? signOut() : null
    setOpen(false)
  }

  const roledmenuRouteList = menuFilter(role).map(
    (index) => menuRouteList[index]
  )
  const roledmenuListTranslations = menuFilter(role).map(
    (index) => menuListTranslations[index]
  )
  const roledmenuListIcons = menuFilter(role).map(
    (index) => menuListIcons[index]
  )

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      className={scss.sideMenu}
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          left: 0,
          top: headerHeight,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
          }),
          ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          }),
        },
      }}
    >
      <div className={scss.drawerHeader}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <Divider />
      <List>
        {roledmenuListTranslations.map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <NextLink className={scss.link} href={`/${roledmenuRouteList[index]}`}>
              <ListItemButton
                onClick={() => handleListItemButtonClick(text)}
                title={text}
                aria-label={text}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {roledmenuListIcons[index]}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    color: theme.palette.text.primary,
                    opacity: open ? 1 : 0,
                  }}
                />{' '}
              </ListItemButton>
            </NextLink>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default SideMenu
