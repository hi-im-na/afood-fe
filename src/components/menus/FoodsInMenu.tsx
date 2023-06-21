import { IFood } from '@/models/models'
import { Box, Container, Typography } from '@mui/material'
import FoodInMenu from './FoodInMenu'

interface FoodsInMenuProps {
  foodsInMenu: IFood[]
}

export default function FoodsInMenu({ foodsInMenu }: FoodsInMenuProps) {
  return (
    <>
      <Container>
        <Typography variant="h2" component="div" gutterBottom textAlign={'center'} fontWeight={'bold'}>
          Foods in menu
        </Typography>
      </Container>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {foodsInMenu.map((food) => (
          // <Paper key={food.id} sx={{
          //   mr: 1,
          // }}>
          <FoodInMenu foodInMenu={food} key={food.id} />
          // </Paper>
        ))}
      </Box>
    </>
  )
}
