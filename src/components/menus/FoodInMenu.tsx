'use client'
import { IFood } from '@/models/models'
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter'
import Image from 'mui-image'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'

interface FoodInMenuProps {
  foodInMenu: IFood
}

export default function FoodInMenu({ foodInMenu }: FoodInMenuProps) {
  return (
    <>
      <Card
        sx={{
          m: 0.5,
          width: 300,
          minHeight: 275,
          // maxHeight: 550,
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div" sx={{ lineHeight: 1 }}>
            <h2>{capitalizeFirstLetter(foodInMenu.name)}</h2>
          </Typography>
          <Box>
            <Image
              src={'/images/' + foodInMenu.name + '.webp'}
              showLoading
              height={350}
              width="100%"
            />
          </Box>
          <Typography sx={{ my: 1.5 }} color="text.secondary" fontWeight="bold">
            Description
          </Typography>
          <Typography variant="body2">
            {foodInMenu.description}
            <br />
          </Typography>
          <Typography variant="body2">
            {foodInMenu.cost}
            <br />
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </>
  )
}
