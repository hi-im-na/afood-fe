import { IMenu } from '@/models/models'
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'

interface MenuProps {
  menu: IMenu
}

export default function Menu({ menu }: MenuProps) {
  const theme = useTheme()
  const router = useRouter()
  const seeMenu = () => {
    router.push(`/menu/${menu.id}`)
  }

  return (
    <>
      <Card
        sx={{
          minWidth: 275,
          maxWidth: 275,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Menu&#39;s name
          </Typography>
          <Typography variant="h5" component="div">
            <h2>{capitalizeFirstLetter(menu.name)}</h2>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Description
          </Typography>
          <Typography variant="body2">
            {menu.description}
            <br />
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={seeMenu}>
            See menu
          </Button>
        </CardActions>
      </Card>
    </>
  )
}
