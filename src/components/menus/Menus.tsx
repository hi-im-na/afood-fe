import { IMenu } from '@/models/IMenu'
import { Box, Paper } from '@mui/material'
import Menu from './Menu'

interface MenuProps {
  menus: IMenu[]
}

export default function Menus({ menus }: MenuProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {menus.map((menu) => (
          <Paper key={menu.id}>
            <Menu menu={menu} />
          </Paper>
        ))}
      </Box>
    </>
  )
}
