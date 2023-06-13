import { IFood } from '@/models/models'
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter'
import {
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
          width: 300,
          minHeight: 275,
          maxHeight: 550,
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Food's name
          </Typography>
          <Typography variant="h5" component="div">
            <h2>{capitalizeFirstLetter(foodInMenu.name)}</h2>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Description
          </Typography>
          <Typography variant="body2">
            {foodInMenu.description}
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
