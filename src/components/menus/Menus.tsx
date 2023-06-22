import { IMenu } from '@/models/models'
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
          <Paper key={menu.id} sx={{
            m: 1,
          }}>
            <Menu menu={menu} />
          </Paper>
        ))}
      </Box>
    </>
  )
}
