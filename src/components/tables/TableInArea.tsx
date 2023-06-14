import { ITableRestaurant } from '@/models/models'
import { Card, CardContent, Typography } from '@mui/material'

interface TableInAreaProps {
  tableInArea: ITableRestaurant
}

const tableStatusColor: { [key: string]: string } = {
  AVAILABLE: 'green',
  OCCUPIED: 'orange',
  RESERVED: 'red',
}

export default function TableInArea({ tableInArea }: TableInAreaProps) {
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
          <Typography variant="h5" component="div">
            <h2>Table {tableInArea.id}</h2>
          </Typography>
          <Typography component="span" sx={{ mb: 1.5 }} color="text.secondary">
            Status:
          </Typography>
          <Typography
            component="span"
            sx={{ mb: 1.5 , fontWeight: 'bold'}}
            color={tableStatusColor[tableInArea.tableStatus]}
          >
            {' ' + tableInArea.tableStatus}
          </Typography>
          <Typography variant="body2">
            <br />
          </Typography>
          <Typography variant="body2">
            {tableInArea.maxCapacity} seats
            <br />
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
